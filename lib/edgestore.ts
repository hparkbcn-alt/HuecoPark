"use client";

import { createEdgeStoreProvider } from "@edgestore/react";

// Stub EdgeStoreRouter since EdgeStore is disabled
const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider();

export { EdgeStoreProvider, useEdgeStore };
