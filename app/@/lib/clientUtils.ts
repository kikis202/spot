"use client";

import { useCallback, useState, useEffect, useMemo } from "react";

function useStorage<T>(
  key: string,
  defaultValue: T | (() => T),
  storageType: "local" | "session",
): [T, (newValue: T) => void, () => void] {
  const storageObject = useMemo(() => {
    const isClient = typeof window === "object";

    if (storageType === "local") {
      return isClient ? window.localStorage : null;
    } else {
      return isClient ? window.sessionStorage : null;
    }
  }, [storageType]);

  const [value, setValue] = useState<T>(() => {
    if (!storageObject)
      return typeof defaultValue === "function"
        ? (defaultValue as () => T)()
        : defaultValue;

    const jsonValue = storageObject.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue) as T;

    if (typeof defaultValue === "function") {
      return (defaultValue as () => T)();
    } else {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (storageObject) {
      if (value === undefined) {
        storageObject.removeItem(key);
      } else {
        storageObject.setItem(key, JSON.stringify(value));
      }
    }
  }, [key, value, storageObject]);

  const remove = useCallback(() => {
    setValue(undefined as unknown as T);
  }, []);

  return [value, setValue, remove];
}

export function useLocalStorage<T>(key: string, defaultValue: T | (() => T)) {
  return useStorage<T>(key, defaultValue, "local");
}

export function useSessionStorage<T>(key: string, defaultValue: T | (() => T)) {
  return useStorage<T>(key, defaultValue, "session");
}

export function setSessionStorageValue<T>(key: string, value: T) {
  if (value === undefined) {
    window.sessionStorage.removeItem(key);
  } else {
    console.log("setting", key, value);
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }
}

export function getSessionStorageValue<T>(key: string, defaultValue: T) {
  const value = window.sessionStorage.getItem(key);
  if (!value) return defaultValue;
  return JSON.parse(value) as T;
}
