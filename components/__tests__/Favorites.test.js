import React from "react";
import { render, act, waitFor } from "@testing-library/react-native";
import {
  FavoritesProvider,
  useFavorites,
} from "../../context/FavoritesContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe("FavoritesProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with empty favorites", async () => {
    AsyncStorage.getItem.mockResolvedValue(null);

    let utils;
    await act(async () => {
      utils = render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );
    });

    await waitFor(() => {
      const { result } = utils;
      expect(result.current.favorites).toEqual([]);
    });
  });

  it("should add item to favorites", async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify({ id: "1" }));

    let utils;
    await act(async () => {
      utils = render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );
    });

    const { result } = utils;
    await act(async () => {
      await result.current.addToFavorites({ id: "1", name: "Test Item" });
    });

    expect(result.current.favorites).toEqual([{ id: "1", name: "Test Item" }]);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "favorites_1",
      JSON.stringify([{ id: "1", name: "Test Item" }])
    );
  });

  it("should remove item from favorites", async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify({ id: "1" }));

    let utils;
    await act(async () => {
      utils = render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );
    });

    const { result } = utils;
    await act(async () => {
      await result.current.addToFavorites({ id: "1", name: "Test Item" });
      await result.current.removeFromFavorites("1");
    });

    expect(result.current.favorites).toEqual([]);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "favorites_1",
      JSON.stringify([])
    );
  });

  it("should check if an item is a favorite", async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify({ id: "1" }));

    let utils;
    await act(async () => {
      utils = render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );
    });

    const { result } = utils;
    await act(async () => {
      await result.current.addToFavorites({ id: "1", name: "Test Item" });
    });

    expect(result.current.isFavorite("1")).toBe(true);
    expect(result.current.isFavorite("2")).toBe(false);
  });

  it("should clear all favorites", async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify({ id: "1" }));

    let utils;
    await act(async () => {
      utils = render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );
    });

    const { result } = utils;
    await act(async () => {
      await result.current.addToFavorites({ id: "1", name: "Test Item" });
      await result.current.clearAllFavorites();
    });

    expect(result.current.favorites).toEqual([]);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "favorites_1",
      JSON.stringify([])
    );
  });
});

const TestComponent = () => {
  const {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearAllFavorites,
  } = useFavorites();
  return <></>;
};
