import React from "react";
import { render, act, waitFor } from "@testing-library/react-native";
import { TimerProvider, useTimer } from "../../context/TimerContext";
jest.useFakeTimers();

describe("TimerProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with 10 minutes remaining time", () => {
    const utils = render(
      <TimerProvider>
        <TestComponent />
      </TimerProvider>
    );

    const { result } = utils;
    expect(result.current.remainingTime).toBe(600);
  });

  it("should decrement remaining time every second when order is in progress", () => {
    const utils = render(
      <TimerProvider>
        <TestComponent />
      </TimerProvider>
    );

    const { result } = utils;
    act(() => {
      result.current.setOrderInProgress(true);
    });

    expect(result.current.orderInProgress).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1000); // Avance de 1 seconde
    });

    expect(result.current.remainingTime).toBe(599);

    act(() => {
      jest.advanceTimersByTime(1000); // Avance de 1 seconde supplémentaire
    });

    expect(result.current.remainingTime).toBe(598);
  });

  it("should stop decrementing when remaining time reaches 0", () => {
    const utils = render(
      <TimerProvider>
        <TestComponent />
      </TimerProvider>
    );

    const { result } = utils;
    act(() => {
      result.current.setOrderInProgress(true);
      result.current.setRemainingTime(1);
    });

    act(() => {
      jest.advanceTimersByTime(1000); // Avance de 1 seconde
    });

    expect(result.current.remainingTime).toBe(0);
    expect(result.current.orderInProgress).toBe(false);
  });

  it("should not decrement when order is not in progress", () => {
    const utils = render(
      <TimerProvider>
        <TestComponent />
      </TimerProvider>
    );

    const { result } = utils;
    act(() => {
      result.current.setOrderInProgress(false);
    });

    act(() => {
      jest.advanceTimersByTime(1000); // Avance de 1 seconde
    });

    expect(result.current.remainingTime).toBe(600);
  });
});

const TestComponent = () => {
  const {
    remainingTime,
    setRemainingTime,
    orderInProgress,
    setOrderInProgress,
  } = useTimer();
  return <></>;
};
