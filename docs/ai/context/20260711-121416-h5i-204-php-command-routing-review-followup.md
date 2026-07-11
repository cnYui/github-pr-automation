# h5i #204 PHP 命令路由 review 跟进

## Review 发现

首版 `match_command` 只覆盖 `php vendor/bin/phpunit`，会漏掉常见的 PHP 解释器选项调用：

- `php -d xdebug.mode=coverage vendor/bin/phpunit`
- `php -d memory_limit=-1 ./vendor/bin/phpunit`
- `php -c php.ini vendor/bin/phpunit`

内联 golden tests 直接按 filter 名调用规则，不经过 `match_command`；只跑 golden 无法发现路由漏配。

## 修正方案

- 仅允许 PHPUnit 脚本前出现明确的 PHP 配置选项：`-d`、`-c`、`-n`。
- 不使用“任意 `-<option>` + 任意参数”的宽泛模式，避免把 `php -r phpunit` 或普通 PHP 脚本误判为 PHPUnit。
- 在 `src/filter_rules.rs` 的路由测试中加入：
  - 直接 `phpunit` 和路径形式。
  - `php -d ... vendor/bin/phpunit`、`php -c ... ./vendor/bin/phpunit` 正例。
  - `php script.php phpunit`、`php -r phpunit`、`phpunit-wrapper` 负例。

## 验证

重新运行：

```powershell
cargo test --no-default-features builtin_golden_tests_pass
cargo test --no-default-features known_commands_route_to_expected_rules
cargo test --no-default-features phpunit_command_routing_stays_narrow
cargo test --no-default-features --test filter_quality
cargo clippy --no-default-features --all-targets -- -D warnings
git diff --check
```
