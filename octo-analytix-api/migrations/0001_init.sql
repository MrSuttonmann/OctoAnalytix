-- Migration number: 0001 	 2024-04-08T14:41:32.942Z
create table users
(
    id              integer primary key autoincrement,
    email           text not null unique,
    password        text not null,
    name            text not null,
    octopus_api_key text not null,
    octopus_acc_num text not null,
    created_date    date not null
);

create table users_sessions
(
    session_id  integer primary key autoincrement,
    user_id     integer not null
        constraint users_sessions_users_id_fk
            references users
            on update cascade on delete cascade,
    token       text not null,
    expires_at  integer not null
);