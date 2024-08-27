use collabor8;
select username,email,is_verified from Users;
delete from Users where is_verified=0;
select username,email,is_verified from Users;
