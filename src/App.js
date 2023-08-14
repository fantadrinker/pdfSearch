import React from "react";
import { Ping } from "./components/Ping";
import { Files } from "./components/Files";
import { SelectDirectory } from "./components/SelectDirectory";

export function App() {
  return (
    <main>
      <section>
        <Ping />
      </section>
      <section>
        <SelectDirectory />
      </section>
      <section>
        <Files />
      </section>
    </main>
  );

}