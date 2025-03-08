import React from "react";
import { render, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OrderProvider, useOrder } from "../../context/OrderContext";

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

// Test component that uses the OrderContext
function TestComponent({ testId }) {
  const { orders, addOrder } = useOrder();

  return (
    <div data-testid={testId}>
      <button
        data-testid="add-order"
        onPress={() =>
          addOrder([
            {
              id: 1,
              nom: "Test Item",
              prix: 10,
              quantity: 2,
              image: "test.jpg",
            },
          ])
        }
      />
      <div data-testid="orders">{JSON.stringify(orders)}</div>
    </div>
  );
}

// Wrapper component with OrderProvider
function TestWrapper({ children }) {
  return <OrderProvider>{children}</OrderProvider>;
}

describe("OrderContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockClear();
    AsyncStorage.setItem.mockClear();

    // Mock Date.now to return a fixed timestamp for testing
    jest.spyOn(Date, "now").mockImplementation(() => 1625097600000); // July 1, 2021
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("initializes with empty orders array when no user is logged in", async () => {
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
      expect(component.getByTestId("orders").props.children).toBe("[]"); // Empty orders
    });
  });

  test("loads user orders from AsyncStorage when a user is logged in", async () => {
    // Mock user data
    const mockUser = { id: "user123" };
    const mockOrders = [
      {
        id: "order1",
        items: [
          { id: 1, nom: "Test Item", prix: 10, quantity: 2, image: "test.jpg" },
        ],
        status: "delivered",
        date: 1625007600000,
        total: 20,
      },
    ];

    // Mock AsyncStorage
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "user") return Promise.resolve(JSON.stringify(mockUser));
      if (key === `orders_${mockUser.id}`)
        return Promise.resolve(JSON.stringify(mockOrders));
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
      expect(
        JSON.parse(component.getByTestId("orders").props.children)
      ).toEqual(mockOrders);
    });
  });

  test("adds a new order correctly", async () => {
    // Mock user data
    const mockUser = { id: "user123" };

    // Mock AsyncStorage
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "user") return Promise.resolve(JSON.stringify(mockUser));
      if (key === `orders_${mockUser.id}`) return Promise.resolve("[]");
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

    // Initial check
    await waitFor(() => {
      expect(component.getByTestId("orders").props.children).toBe("[]");
    });

    // Add order
    await act(async () => {
      component.getByTestId("add-order").props.onPress();
    });

    // Check order was added with correct properties
    await waitFor(() => {
      const orders = JSON.parse(component.getByTestId("orders").props.children);
      expect(orders.length).toBe(1);
      expect(orders[0].items).toEqual([
        { id: 1, nom: "Test Item", prix: 10, quantity: 2, image: "test.jpg" },
      ]);
      expect(orders[0].status).toBe("in-progress");
      expect(orders[0].total).toBe(20); // 10 * 2
      expect(orders[0].date).toBe(1625097600000); // Our mocked date

      // Verify order was saved to AsyncStorage
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        `orders_${mockUser.id}`,
        JSON.stringify(orders)
      );
    });
  });

  test("persists orders after user change", async () => {
    // Mock first user data
    const mockUser1 = { id: "user1" };
    const mockOrders1 = [
      {
        id: "order1",
        items: [{ id: 1, nom: "User1 Item", prix: 10, quantity: 1 }],
        status: "delivered",
        date: 1625007600000,
        total: 10,
      },
    ];

    // Mock AsyncStorage for first user
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "user") return Promise.resolve(JSON.stringify(mockUser1));
      if (key === `orders_${mockUser1.id}`)
        return Promise.resolve(JSON.stringify(mockOrders1));
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

    // Check first user's orders
    await waitFor(() => {
      expect(
        JSON.parse(component.getByTestId("orders").props.children)
      ).toEqual(mockOrders1);
    });

    // Mock second user data
    const mockUser2 = { id: "user2" };
    const mockOrders2 = [
      {
        id: "order2",
        items: [{ id: 2, nom: "User2 Item", prix: 15, quantity: 2 }],
        status: "in-progress",
        date: 1625017600000,
        total: 30,
      },
    ];

    // Change the mock implementation to simulate user change
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "user") return Promise.resolve(JSON.stringify(mockUser2));
      if (key === `orders_${mockUser2.id}`)
        return Promise.resolve(JSON.stringify(mockOrders2));
      return Promise.resolve(null);
    });

    // Trigger user change interval check manually
    jest.advanceTimersByTime(1000);

    // Check that orders were saved for user1 and loaded for user2
    await waitFor(() => {
      // Verify data saved for user1
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        `orders_${mockUser1.id}`,
        JSON.stringify(mockOrders1)
      );

      // Check that new user data is displayed
      expect(
        JSON.parse(component.getByTestId("orders").props.children)
      ).toEqual(mockOrders2);
    });
  });
});
