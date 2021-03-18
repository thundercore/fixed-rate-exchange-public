import Home from "pages/Home";
import Admin from "pages/Admin";
import Pair from "pages/Pair";
import { Switch, Route } from "react-router-dom";

const routes = [
  { key: "Home", path: "/", component: Home, exact: true },
  { key: "Admin", path: "/admin", component: Admin, exact: true },
  { key: "Pair", path: "/pair/(user|admin)/:pairAddress", component: Pair },
];

export default function RenderRoutes() {
  return (
    <Switch>
      {routes.map((route) => (
        <Route
          path={route.path}
          exact={route.exact}
          key={route.key}
          render={(props) => <route.component {...props} />}
        />
      ))}
    </Switch>
  );
}
