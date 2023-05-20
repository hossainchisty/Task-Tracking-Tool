#### API Routers and Methods

List all the API routes and HTTP methods used in the project, along with a brief description of what each endpoint does.

#### Task Creation and Management:

- `/api/v1/tasks` - `GET`: Get all tasks
- `/api/v1/tasks/item/:taskID` - `GET`: Get a single task
- `/api/v1/tasks` - `POST`: Create a new task
- `/api/v1/tasks/:taskID` - `PUT`: Update task
- `/api/v1/tasks/:taskID` - `DELETE`: Delete task
- `/api/v1/tasks/:taskID` - `GET`: Mark the task as completed

#### Task Sorting and Filtering:

- `/api/v1/tasks/status/:status` - `GET`: Find tasks based on status

- `/api/v1/tasks/priority/:priority` - `GET`: Find tasks based on priority

- `/api/v1/tasks/filter?sortBy=dueDate&sortDirection=asc&title=homework&dueDate=2023-05-31&priority=high` - `GET`: Get all tasks, optionally sorted and filtered

#### Task Categories and Tags:

- `/api/v1/tag/` - `GET`: List of tags

- `/api/v1/tag/` - `POST`: Create a new tag

- `/api/v1/tag/:tagID` - `PUT`: Update tags

- `/api/v1/tag/:tagID` - `DELETE`: Delete tags

- `/api/v1/category/` - `GET`: Get all category

- `/api/v1/category/` - `POST`: Create a new category

- `/api/v1/category/:categoryID` - `PUT`: Update category

- `/api/v1/category/:categoryID` - `DELETE`: Delete category

#### User Profile:

- `/api/v1/users/register` - `POST`: Register new user

- `/api/v1/users/login` - `POST`: Authenticate a user

- `/api/v1/users/forget-password` - `POST`: Forget password functionality for users

- `/api/v1/users/me` - `GET`: Get user data
