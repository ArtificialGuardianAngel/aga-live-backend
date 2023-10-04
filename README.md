# AGA Chat Backend


## Enviroment variables

### Configuration
| Name                | Description              | Default value                             | Local value                                                                               |
| ------------------- | ------------------------ | ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| PORT                | Application serve port   | 3000                                      | 3000                                                                                      |
| SOCKET_PORT         | Socket io serve port     | 3001                                      | 3001                                                                                      |
| JWT_SECRET_PASSWORD |                          |                                           |                                                                                           |
| ORIGINS             | List of origins for cors | `https://aga.live,https://admin.aga.live` | `http://localhost:8888,http://127.0.0.1:8888,http://127.0.0.1:5173,http://localhost/5173` |
### Database

| Name        | Description                            | Default value | Local value            |
| ----------- | -------------------------------------- | ------------- | ---------------------- |
| MONGODB_URI | Url for database                       | ---           | ---                    |
| REDIS_URL   | Url for redis database used in sockets | ---           | redis://localhost:6379 |

### MQ configuration
| Name                   | Description | Default value | Local value |
| ---------------------- | ----------- | ------------- | ----------- |
| RMQ_HOST               |             |               |             |
| RMQ_QUERY_PROMPT       |             |               |             |
| RMQ_QUERY_PROMPT_REPLY |             |               |             |

### Mining feature

| Name                     | Description | Default value | Local value |
| ------------------------ | ----------- | ------------- | ----------- |
| MINING_COINS_PER_QUERY   |             |               |             |
| MINING_COINS_MAX_PER_DAY |             |               |             |

### Third party integrations

| Name                 | Description | Default value | Local value |
| -------------------- | ----------- | ------------- | ----------- |
| SLACK_API_KEY        |             |               |             |
| BOLDSIGN_API_URL     |             |               |             |
| BOLDSIGN_API_KEY     |             |               |             |
| BOLDSIGN_TEMPLATE_ID |             |               |             |
| SMARTPAY_API_KEY     |             |               |             |
| SMARTPAY_SECRET_KEY  |             |               |             |
