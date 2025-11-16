"use client";

export function LanguageSwitcher() {
  return (
    <div style={{ position: "fixed", right: 12, top: 12, zIndex: 10, display: "flex", gap: 8 }}>
      <button
        onClick={() => {
          localStorage.setItem("lang", "en");
          window.location.reload();
        }}
        style={{ padding: "4px 8px", cursor: "pointer" }}
      >
        EN
      </button>
      <button
        onClick={() => {
          localStorage.setItem("lang", "sr");
          window.location.reload();
        }}
        style={{ padding: "4px 8px", cursor: "pointer" }}
      >
        SR
      </button>
    </div>
  );
}


