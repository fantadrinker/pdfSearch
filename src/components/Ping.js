import React from "react";

export function Ping() {
  const [pong, setPong] = React.useState('');
  async function ping() {
    const response = await window.electron.ping();
    setPong(response);
  }
  return (
    <div>
      <h1>Ping</h1>
      <button onClick={ping}>Ping</button>
      {pong && <p>{pong}</p>}
    </div>
  );
}