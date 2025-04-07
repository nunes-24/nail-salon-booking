import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerLocale } from "react-datepicker";
import pt from 'date-fns/locale/pt';

// Register Portuguese locale for date picker
registerLocale('pt', pt);

createRoot(document.getElementById("root")!).render(<App />);
