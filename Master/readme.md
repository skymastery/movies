Movies / Tsoklan A.

REST API / CRUD
using:
nodejs/mysql/sequelize/express


! Запуск:

1. Перейти в корень проекта (папка  Master);
2. Запустить через "docker-compose up" в терминале, дождаться полного запуска (создания БД и таблиц), после чего можно пользоваться;

Реализованы все возможности описанные в спецификации по полученой ссылке:
https://documenter.getpostman.com/view/356840/TzkyLeVK#11fde7a2-c427-49d8-865b-444cb8e01c89

API умеет:

- зарегистрировать пользователя (email, password, confirmPassword). Строка confirmPassword не сохраняется в БД. Пароль хешируется с уникальной солью на этапе отправки информации, и в БД сохраняется уже захешированый. Пароль спрятан в теле ответа на запрос. Ввод эмейла контролируется валидатором isEmail. 1 эмейл = 1 пользователь;
- залогиниться (email, password): модуль bcrypto проверяет пароль. При успешном логине в теле ответа приходит accessToken (jwt). У каждого пользователя свой уникальный токен. Во всех запросах кроме регистрации и логина будет происходить проверка токена. Токен не экспайрится, потому что в контексте использования этого приложения это неактуально;
- добавлять фильм в теле post запроса (поля title, year, format, actors).
- при добавлении фильма, актеры из запроса автоматически записываются в свою отдельную таблицу, и формируется ассоциация через смежную таблицу (many-to-many). Если при добавлении другого фильма среди актеров есть этот актер, то к уже существующему актеру добавится еще одна ассоциация с другим фильмом, в смежной таблице;
- импортировать .txt (form-data) со списком фильмов, которые будут записаны в БД. Файл парсится и записывается в БД. Записи не добавляются, если они уже есть в БД;
- обновлять запись в БД о каком-то фильме или актере, не меняя уникальный ID, а меняя отдельные строки;
- удалять запись в БД о каком-то фильме;
- посмотреть список всех фильмов, с возможностью добавления в запрос различных параметров, таких как сортировка по году выпуска, поиск по названию и т.д. (из спецификации);
- возможность посмотреть инфо о конкретном фильме по ID;
