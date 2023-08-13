import React from "react";
import { Ping } from "./components/Ping";
import { Files } from "./components/Files";
import { SelectDirectory } from "./components/SelectDirectory";

export function App() {
  return (
    <div>
      <Ping />
      <SelectDirectory />
      <Files />
    </div>
  );

}