import { type RouteConfiag,route } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';

export default [
	  route("/products", "./routes/products/list.tsx"),
	...await(flatRoutes()),
] satisfies RouteConfig;