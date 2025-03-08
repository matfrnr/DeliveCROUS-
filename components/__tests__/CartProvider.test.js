import React from "react";
import { render, act, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartProvider, useCart } from "../../context/CartContext";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock Alert
jest.mock("react-native", () => {
  const rn = jest.requireActual("react-native");
  return {
    ...rn,
    Alert: {
      alert: jest.fn(),
    },
  };
});

// Test component that uses the CartContext
function TestComponent({ testId }) {
  const {
    cartItems,
    balance,
    addToCart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    processOrder,
    clearCart,
    addFunds,
    userId,
  } = useCart();

  return (
    <div data-testid={testId}>
      <button
        data-testid="add-item"
        onPress={() =>
          addToCart({ id: 1, nom: "Test Item", prix: 10, image: "test.jpg" })
        }
      />
      <button
        data-testid="update-quantity"
        onPress={() => updateQuantity(1, 3)}
      />
      <button data-testid="remove-item" onPress={() => removeFromCart(1)} />
      <button data-testid="process-order" onPress={() => processOrder()} />
      <button data-testid="clear-cart" onPress={() => clearCart()} />
      <button data-testid="add-funds" onPress={() => addFunds(20)} />
      <div data-testid="cart-items">{JSON.stringify(cartItems)}</div>
      <div data-testid="balance">{balance}</div>
      <div data-testid="cart-total">{getCartTotal()}</div>
      <div data-testid="user-id">{userId}</div>
    </div>
  );
}

// Wrapper component with CartProvider
function TestWrapper({ children }) {
  return <CartProvider>{children}</CartProvider>;
}

describe("CartContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockClear();
    AsyncStorage.setItem.mockClear();
  });

  test("initializes with default values when no user is logged in", async () => {
    // Mock AsyncStorage to return null for user
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "user") return Promise.resolve(null);
      return Promise.resolve(null);
    });

    let component;
    await act(async () => {
      component = render(
        <TestWrapper>
          <TestComponent testId="test-component" />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      expect(component.getByTestId("balance").props.children).toBe(50); // Default balance
      expect(component.getByTestId("cart-items").props.children).toBe("[]"); // Empty cart
      expect(component.getByTestId("user-id").props.children).toBe(null); // No user
    });
  });

  test("loads user data from AsyncStorage when a user is logged in", async () => {
    // Mock user data
    const mockUser = { id: "user123" };
    const mockCartItems = [
      { id: 1, nom: "Test Item", prix: 10, quantity: 2, image: "test.jpg" },
    ];
    const mockBalance = "75.5";

    // Mock AsyncStorage
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "user") return Promise.resolve(JSON.stringify(mockUser));
      if (key === `cartItems_${mockUser.id}`)
        return Promise.resolve(JSON.stringify(mockCartItems));
      if (key === `balance_${mockUser.id}`) return Promise.resolve(mockBalance);
      return Promise.resolve(null);
    });

    let component;
    await act(async () => {
      component = render(
        <TestWrapper>
          <TestComponent testId="test-component" />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      expect(component.getByTestId("balance").props.children).toBe(75.5); // Loaded balance
      expect(
        JSON.parse(component.getByTestId("cart-items").props.children)
      ).toEqual(mockCartItems); // Loaded cart
      expect(component.getByTestId("user-id").props.children).toBe("user123"); // Loaded user
    });
  });

  test("sets default balance for new user with no saved balance", async () => {
    // Mock user data
    const mockUser = { id: "newuser456" };

    // Mock AsyncStorage
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "user") return Promise.resolve(JSON.stringify(mockUser));
      return Promise.resolve(null); // No saved cart or balance
    });

    let component;
    await act(async () => {
      component = render(
        <TestWrapper>
          <TestComponent testId="test-component" />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      expect(component.getByTestId("balance").props.children).toBe(50); // Default balance
      expect(component.getByTestId("cart-items").props.children).toBe("[]"); // Empty cart
      expect(component.getByTestId("user-id").props.children).toBe(
        "newuser456"
      ); // New user

      // Verify that default balance was saved
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        `balance_${mockUser.id}`,
        "50"
      );
    });
  });

  test("add funds increases balance and persists it", async () => {
    // Mock user data
    const mockUser = { id: "user123" };
    const initialBalance = "50";

    // Mock AsyncStorage
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "user") return Promise.resolve(JSON.stringify(mockUser));
      if (key === `balance_${mockUser.id}`)
        return Promise.resolve(initialBalance);
      return Promise.resolve(null);
    });

    let component;
    await act(async () => {
      component = render(
        <TestWrapper>
          <TestComponent testId="test-component" />
        </TestWrapper>
      );
    });

    // Initial balance check
    await waitFor(() => {
      expect(component.getByTestId("balance").props.children).toBe(50);
    });

    // Add funds
    await act(async () => {
      component.getByTestId("add-funds").props.onPress();
    });

    // Check updated balance
    await waitFor(() => {
      expect(component.getByTestId("balance").props.children).toBe(70); // 50 + 20
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "balance_user123",
        "70"
      );
    });
  });

  test("process order deducts correct amount from balance", async () => {
    // Mock user data
    const mockUser = { id: "user123" };
    const initialBalance = "100";
    const mockCartItems = [
      { id: 1, nom: "Item 1", prix: 10, quantity: 2, image: "test1.jpg" },
      { id: 2, nom: "Item 2", prix: 15, quantity: 1, image: "test2.jpg" },
    ];

    // Mock AsyncStorage
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "user") return Promise.resolve(JSON.stringify(mockUser));
      if (key === `cartItems_${mockUser.id}`)
        return Promise.resolve(JSON.stringify(mockCartItems));
      if (key === `balance_${mockUser.id}`)
        return Promise.resolve(initialBalance);
      return Promise.resolve(null);
    });

    let component;
    await act(async () => {
      component = render(
        <TestWrapper>
          <TestComponent testId="test-component" />
        </TestWrapper>
      );
    });

    // Initial checks
    await waitFor(() => {
      expect(component.getByTestId("balance").props.children).toBe(100);
      expect(component.getByTestId("cart-total").props.children).toBe(35); // (10 * 2) + (15 * 1)
    });

    // Process order
    await act(async () => {
      component.getByTestId("process-order").props.onPress();
    });

    // Check updated state
    await waitFor(() => {
      expect(component.getByTestId("balance").props.children).toBe(65); // 100 - 35
      expect(component.getByTestId("cart-items").props.children).toBe("[]"); // Cart cleared

      // Verify balance saved
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "balance_user123",
        "65"
      );

      // Verify cart cleared in storage
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "cartItems_user123",
        "[]"
      );
    });
  });

  test("prevents order processing when balance is insufficient", async () => {
    // Mock user data
    const mockUser = { id: "user123" };
    const initialBalance = "20";
    const mockCartItems = [
      {
        id: 1,
        nom: "Expensive Item",
        prix: 30,
        quantity: 1,
        image: "test.jpg",
      },
    ];

    // Mock AsyncStorage
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "user") return Promise.resolve(JSON.stringify(mockUser));
      if (key === `cartItems_${mockUser.id}`)
        return Promise.resolve(JSON.stringify(mockCartItems));
      if (key === `balance_${mockUser.id}`)
        return Promise.resolve(initialBalance);
      return Promise.resolve(null);
    });

    // Mock Alert
    Alert.alert = jest.fn();

    let component;
    await act(async () => {
      component = render(
        <TestWrapper>
          <TestComponent testId="test-component" />
        </TestWrapper>
      );
    });

    // Initial checks
    await waitFor(() => {
      expect(component.getByTestId("balance").props.children).toBe(20);
      expect(component.getByTestId("cart-total").props.children).toBe(30);
    });

    // Attempt to process order
    await act(async () => {
      component.getByTestId("process-order").props.onPress();
    });

    // Check that state didn't change
    await waitFor(() => {
      expect(component.getByTestId("balance").props.children).toBe(20); // Balance unchanged
      expect(
        JSON.parse(component.getByTestId("cart-items").props.children)
      ).toEqual(mockCartItems); // Cart unchanged

      // Verify alert was shown
      expect(Alert.alert).toHaveBeenCalledWith(
        "Insufficient Balance",
        "You don't have enough balance to complete this order."
      );
    });
  });

  test("handles user change correctly by saving data for previous user", async () => {
    // Mock first user data
    const mockUser1 = { id: "user1" };
    const mockCartItems1 = [
      { id: 1, nom: "User1 Item", prix: 10, quantity: 1, image: "test1.jpg" },
    ];
    const initialBalance1 = "100";

    // Mock AsyncStorage for first user
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "user") return Promise.resolve(JSON.stringify(mockUser1));
      if (key === `cartItems_${mockUser1.id}`)
        return Promise.resolve(JSON.stringify(mockCartItems1));
      if (key === `balance_${mockUser1.id}`)
        return Promise.resolve(initialBalance1);
      return Promise.resolve(null);
    });

    let component;
    await act(async () => {
      component = render(
        <TestWrapper>
          <TestComponent testId="test-component" />
        </TestWrapper>
      );
    });

    // Initial checks for user1
    await waitFor(() => {
      expect(component.getByTestId("user-id").props.children).toBe("user1");
      expect(component.getByTestId("balance").props.children).toBe(100);
    });

    // Mock second user data
    const mockUser2 = { id: "user2" };
    const mockCartItems2 = [
      { id: 2, nom: "User2 Item", prix: 15, quantity: 2, image: "test2.jpg" },
    ];
    const initialBalance2 = "75";

    // Change the mock implementation to simulate user change
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "user") return Promise.resolve(JSON.stringify(mockUser2));
      if (key === `cartItems_${mockUser2.id}`)
        return Promise.resolve(JSON.stringify(mockCartItems2));
      if (key === `balance_${mockUser2.id}`)
        return Promise.resolve(initialBalance2);
      return Promise.resolve(null);
    });

    // Trigger user change interval check manually
    jest.advanceTimersByTime(1000);

    // Check that data was saved for user1 and loaded for user2
    await waitFor(() => {
      // Verify data saved for user1
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        `cartItems_${mockUser1.id}`,
        JSON.stringify(mockCartItems1)
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        `balance_${mockUser1.id}`,
        initialBalance1
      );

      // Check that new user data is displayed
      expect(component.getByTestId("user-id").props.children).toBe("user2");
      expect(component.getByTestId("balance").props.children).toBe(75);
      expect(
        JSON.parse(component.getByTestId("cart-items").props.children)
      ).toEqual(mockCartItems2);
    });
  });

  test("handles logout correctly", async () => {
    // Mock initial logged in user
    const mockUser = { id: "user123" };
    const mockCartItems = [
      { id: 1, nom: "Test Item", prix: 10, quantity: 1, image: "test.jpg" },
    ];
    const initialBalance = "50";

    // Mock AsyncStorage for logged in user
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "user") return Promise.resolve(JSON.stringify(mockUser));
      if (key === `cartItems_${mockUser.id}`)
        return Promise.resolve(JSON.stringify(mockCartItems));
      if (key === `balance_${mockUser.id}`)
        return Promise.resolve(initialBalance);
      return Promise.resolve(null);
    });

    let component;
    await act(async () => {
      component = render(
        <TestWrapper>
          <TestComponent testId="test-component" />
        </TestWrapper>
      );
    });

    // Initial checks
    await waitFor(() => {
      expect(component.getByTestId("user-id").props.children).toBe("user123");
      expect(component.getByTestId("balance").props.children).toBe(50);
    });

    // Simulate logout
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "user") return Promise.resolve(null); // No user (logged out)
      return Promise.resolve(null);
    });

    // Trigger user change check
    jest.advanceTimersByTime(1000);

    // Check that data was saved and state reset
    await waitFor(() => {
      // Verify user data was saved before logout
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        `cartItems_${mockUser.id}`,
        JSON.stringify(mockCartItems)
      );

      // Check that state was reset
      expect(component.getByTestId("user-id").props.children).toBe(null);
      expect(component.getByTestId("balance").props.children).toBe(50); // Reset to default
      expect(component.getByTestId("cart-items").props.children).toBe("[]"); // Empty cart
    });
  });
});
