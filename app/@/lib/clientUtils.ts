"use client";

import { useCallback, useState, useEffect } from "react";

function useStorage<T>(
  key: string,
  defaultValue: T | (() => T),
  storageObject: Storage,
): [T, (newValue: T) => void, () => void] {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = storageObject.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue) as T;

    if (typeof defaultValue === "function") {
      return (defaultValue as () => T)();
    } else {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (value === undefined) {
      storageObject.removeItem(key);
    } else {
      storageObject.setItem(key, JSON.stringify(value));
    }
  }, [key, value, storageObject]);

  const remove = useCallback(() => {
    setValue(undefined as unknown as T);
  }, []);

  return [value, setValue, remove];
}

export function useLocalStorage<T>(key: string, defaultValue: T | (() => T)) {
  return useStorage<T>(key, defaultValue, window.localStorage);
}

export function useSessionStorage<T>(key: string, defaultValue: T | (() => T)) {
  return useStorage<T>(key, defaultValue, window.sessionStorage);
}
