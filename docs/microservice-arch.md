---
id: microservice-arch
title: 微服务架构
sidebar_label: 微服务架构
---

对于大型复杂的业务系统，业务功能可以拆分成多个相互独立的微服务：

* 每个微服务之间是松耦合的，通过远程协议处理同步、异步请求；
* 每个微服务可以独立部署、扩容、缩容、升级、降级；
* 每个微服务可以独立使用数据库。

## 整体架构

-|Spring Cloud|dubbo
---:|:----:|:----:|
功能|完整方案|服务治理框架|
通讯方式|HTTP RESTful| RPC |
服务发现、注册|Eureka、Consul、Zookeeper|Zookeeper、Nacos|
负载均衡|Ribbon|-|
熔断与容错机制|Hystrix、Sentinel、Resilience4J|-|
配置中心|Config、Apollo|Nacos|
业务网关|Zuul、Gateway|-|
服务监控|SBA|dubbo-admin|
链路跟踪|Zipkin、Skywalking||
服务间调用|Feign|支持多种方式|

### 服务治理

服务治理包含服务注册与发现、服务路由、负载均衡、自我保护等。

其中服务路由包含服务上下线、在线测试、机房就近选择、A/B测试、灰度发布等

负载均衡包含轮训算法、权重算法、随机算法。

自我保护包括服务降级、优雅降级、流量控制。

## 部分1

你好，这里是部分1

## 部分2

你好，这里是部分1

## 部分3

你好，这里是部分1