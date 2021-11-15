import "./styles.css";
import ThemeProvider from "./Material/PrimaryColor";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import DevCodeDoc from "./components/index";
// import TextEditor from "./components/TextEditor";

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={DevCodeDoc} exact />
      </Switch>
    </BrowserRouter>
  );
}
