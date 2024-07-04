import { Application, Router } from "express";
import _ from "lodash";
import user from "./user";

const BASE_ROUTE = "/api";
const API_ROUTE_MAP = {
	"/user": user,
};

function addApiRoute(app: Application): void {
	_.each(API_ROUTE_MAP, (router: Router, route) => {
		const apiRoute = `${BASE_ROUTE}${route}`;
		app.use(apiRoute, router);
	});
}

export default addApiRoute;
