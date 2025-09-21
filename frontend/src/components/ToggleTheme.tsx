import { useTheme } from "../lib/theme";
import { Moon, Sun } from "lucide-react";

export default function ToggleTheme() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label="Toggle theme"
      className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition">
      {theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}
    </button>
  );
}

