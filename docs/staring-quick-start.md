---
id: staring-quick-start
title: 2.0.0快速入门
sidebar_label: 快速入门
---

​	使用starling 2.0.0 可以按照以下步骤进行。**使用过程中如有任何问题可参考下一章节的不兼容升级章节**，可解决大部分出现的升级问题。

1.  通过使用新版web-framework-starter

    如上诉模块中所示，将自动进行配置并增加对core、mvc、security、util、cloud等模块的引入

    ```xml
    <dependency>
        <groupId>com.iquantex.webframework</groupId>
        <artifactId>web-spring-boot-starter</artifactId>
        <version>2.0.0</version>
    </dependency>
    ```

2.  如需兼容原有依赖表部分，则需引入orm-mybatis模块

    该模块需要依赖mybatis。提供原有以下功能的实现（对应注入类见：OrmMybatisConfiguration）：

    -   基于mybatis的entity解析器
    -   根据接口查询按钮
    -   基于字典表查询字典
    -   基于模版名查询模版
    -   基于表名及字段名查询对应字段

    ```xml
    <dependency>
        <groupId>com.iquantex.webframework</groupId>
        <artifactId>orm-mybatis</artifactId>
        <version>2.0.0</version>
    </dependency>
    ```

3.  如需兼容原有依赖redis部分功能，则需引入orm-redis模块

    该模块依赖com.iquantex:orm-redis模块，需另行引入。提供原有以下功能redis的实现（对应注入类见：OrmRedisConfiguration）：

    -   用户登录信息验证
    -   用户接口授权验证
    -   数据权限验证

    ```xml
    <dependency>
        <groupId>com.iquantex.webframework</groupId>
        <artifactId>orm-redis</artifactId>
        <version>2.0.0</version>
    </dependency>
    ```
