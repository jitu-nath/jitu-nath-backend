import { Router } from 'express';
import { DocumentRoutes } from '../modules/document/document.route';
import { UserRoutes } from '../modules/user/user.route';


type TModuleRoutes = {
  path: string;
  route: Router;
};

const router = Router();

const moduleRoutes: TModuleRoutes[] = [
  {
    path: '/document',
    route: DocumentRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },

 
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
