"use client";
import Image from "next/image";

import { useState } from "react";

export default function Collapsible({ title, children, url }) {
  const [isOpened, setIsOpened] = useState(true);

  function toggleCollapsible() {
    setIsOpened((old) => !old);
  }

  return (
    <div>
      <button
        onClick={toggleCollapsible}
        type="button"
        className="rounded-xl px-5 py-2 mt-5 flex justify-between w-full bg-[#323349] text-[#e2e8f0] border-4 border-[#171926]"
      >
        {title}
        <Image
          src={"http://localhost:1337" + url}
          alt="Logo"
          width={20}
          height={20}
        />
      </button>
      <div
        className={`grid duration-200`}
        style={{ "grid-template-rows": isOpened ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden w-fit">{children}</div>
      </div>
    </div>
  );
}
