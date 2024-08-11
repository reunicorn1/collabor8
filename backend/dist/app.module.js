"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const projects_module_1 = require("./projects/projects.module");
const typeorm_1 = require("@nestjs/typeorm");
const project_shares_module_1 = require("./project-shares/project-shares.module");
const user_entity_1 = require("./users/user.entity");
const project_entity_1 = require("./projects/project.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                name: 'mysqlConnection',
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: 'password',
                database: 'users_db',
                entities: [user_entity_1.Users],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                name: 'mongoConnection',
                type: 'mongodb',
                url: 'mongodb://localhost:27017/projects_db',
                database: 'projects_db',
                entities: [project_entity_1.Projects, project_shares_module_1.ProjectSharesModule],
                synchronize: true,
            }),
            users_module_1.UsersModule,
            projects_module_1.ProjectsModule,
            project_shares_module_1.ProjectSharesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map