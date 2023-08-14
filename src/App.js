import React from "react";
import { Files } from "./components/Files";
import { SelectDirectory } from "./components/SelectDirectory";

export function App() {
  return (
    <main>
      <section>
        <SelectDirectory />
      </section>
      <section>
        <Files />
      </section>
    </main>
  );

}