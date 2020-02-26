---
id: starling-intro
title: Staring框架介绍
sidebar_label: STL介绍
---

## 1 通用查询

​	框架提供了通用查询的支持，只需简短的几行代码，就能实现90%的查询功能（局限是只支持单标查询，多表情况可以考虑通过视图关联模拟单表进行实现）。通用查询包含通用（支持分页）查询，通用数据字典默认实现，所有查询支持前端高定制化查询参数过滤，且支持基于表或视图的数据权限过滤。

### 1.1 功能介绍

#### 1.1.1 数据查询（不分页）

​	根据指定Bean解析对应表并结合前端查询过滤参数以后表数据权限配置进行查询。后端对应list方法。

#### 1.1.2 数据查询（分页）

​	基本等同于1.1.1数据查询，此处前端需额外加入分页参数支持。后端对应query方法。

#### 1.1.3 通用数据字典查询

​	支持静态数据字典和动态数据字典查询。静态数据字典为特定的预先配置的字典；动态数据字典为预先在数据字典中配置好的动态类型的字典，从中获取值字段和翻译值字段，而后前端指定对用后端接口，后端根据数据字典key自动根据当前Controller对应Bean并根据字典中配置的值字段和翻译值字段，动态获取表中字段作为数据字典。数据字典配置方式见[数据字典配置](#dict_setting).

##### 静态数据字典

​	查询数据字典中配置的静态数据字典，该方法统一调用QSW中的数据字典接口获取，需要指定数据字典键值（dict_key）。

##### 动态数据字典

​	根据数据字典中配置的动态数据字典模版获取数据字典id、name，并根据指定bean获取对应字段实现数据字典查询。后端对应getDict方法。

### 1.2 使用方式

#### 1.2.1 通用查询支持

实现通用查询需要满足以下三个条件：

- Controller类
    1. 继承BaseWebController类
    2. 重写方法getService，并返回实现BaseService接口的实现或接口
- Service接口需继承BaseService接口
- Service接口实现类
    1. 继承BaseServiceImpl类
    2. 通过在BaseServiceImpl增加泛型指定Bean或通过3实现
    3. 通过重写方法getEntity实现，并返回指定Bean（支持视图Bean）的Entity对象，如果同时满足2，和3，则以3中的为准

代码示例：

```java
/**
 * Controller类示例
 */
@RestController
@RequestMapping("/api/v2/users")
public class SysUserController extends BaseWebController {

    @Autowired
    private SysUserService service;
    
    @Override
    protected BaseService getService() {
        return this.service;
    }

}

/**
 * Service接口示例
 */
public interface SysUserService extends BaseService {
}

/**
 * Service实现示例
 * 1.可通过在BaseServiceImpl后增加泛型指定Bean
 * 2.也可通过重写getEntity方法实现，注意调用EntityCache.getEntity(xxx.class)实现
 * 推荐使用1方式实现，如果2种方式同时满足，则以2为准
 */
@Service
public class SysUserServiceImpl extends BaseServiceImpl<SysUser> implements SysUserService {
    @Override
    protected Entity getEntity() {
        return EntityCache.getEntity(VUser.class);
    }
}
```

#### 1.2.2 前端查询参数

	前端查询配置参数示例，主要依赖filterRule实现，其中包含三个属性：field、op和 value。op为关系符。

关系符如下：

- 等于：eq
- 小于：lt
- 大于：gt
- 小于等于：lte
- 大于等于：gte
- 不等于：neq
- 包含：in
- 不包含：nin
- 模糊查询（包含某个字符）：like
- 模糊查询过滤（不包含某个字符）：nlike
- 在某些之间：between
- 特殊情况包含（字符串包含）：fin

#### 1.2.3 数据权限配置

​	通过``系统设置-权限设置-数据权限-数据权限设置``界面进行配置，通过查询时会自动读取表中配置并进行权限过滤。

配置流程：

- 选择新增，输入表名；

- 选择字段，进行权限配置。分组关系，独立的条件组之间的关系；条件关系，一个条件组内的权限规则的关系。权限规则包括：字段、关系符、值类型和值。支持增加多个分组，分组支持增加多个权限规则。
    - 分组关系和条件关系支持或者（or）和并且（and）。
    - 权限规则关系符和前端查询参数关系符相同。
    - 值类型分为实际数据和默认数据。
        - 默认数据目前支持：当前公司、当前日期、当前角色和当前用户。
        - 实际数据
            - 真实配置的默认值
            - 默认的产品权限设置，需要配置为以下固定字符串
                - 产品：{[user]-[{currentUserId}]-[fund]-[0,1]}
                - 资产单元：{[user]-[{currentUserId}]-[asset_unit]-[0,1]}
                - 策略：{[user]-[{currentUserId}]-[strategy]-[0,1]}
                - 账户：{[user]-[{currentUserId}]-[account]-[0,1]}

#### 1.2.4 数据字典配置

<span id="dict_setting">	通过``系统配置-基础信息-字典管理``界面进行数据字典配置。包含静态数据字典和动态数据字典。</span>

##### 静态数据字典

注意事项：

- 字典ID，全局唯一；
- 字典值、字典值翻译和字典英文值为一组字典项，支持同时输入多项数据字典子项；
- 类型需要选择静态。

##### 动态数据字典

注意事项：

- 字典ID全局唯一
- 字典值对应表中用于表示值的字段
- 字典值翻译对应表中用于显示的值的字段
- 类型需要选择动态
- ``动态数据字典只能添加一组数据字典子项``
- 相同字典值和字典值翻译的动态数据字典尽量进行复用，无需多次进行添加

## 2 统一参数校验

​	基于RAP中配置的校验规则，生成出入参时将自动增加对应校验注解。

### 2.1 使用方式

- RAP中配置校验规则
- RAP接口说明中需配置对应接口的类名和方法名（RAP使用介绍文档中详细说明）
- 在需要校验的方法上标识注解@Valid

### 2.2 代码示例

```java
/**
 * Controller类示例
 */
@RestController
@RequestMapping("/api/v2/users")
public class SysUserController extends BaseWebController {

    @Autowired
    private SysUserService service;
    
  	   /**
     * 新增用户
     * 需要进行参数校验(标识@Valid注解)
     * 
     * @param inParam
     * @return
     */
    @PostMapping()
    public ResultObj addUser(@Valid @RequestBody AddUserInParam inParam) {
        long id = service.addUser(inParam);
        return successReturn().setData(SysUser.f_id, id);
    }

    /**
     * 修改用户
     * 需要进行参数校验(标识@Valid注解)
     * 
     * @param id
     * @param inParam
     * @return
     */
    @PutMapping("/{id}")
    public ResultObj updateUser(@PathVariable long id, @Valid @RequestBody UpdateUserInParam inParam) {
        service.updateUser(inParam, id);
        return successReturn();
    }
  
    @Override
    protected BaseService getService() {
        return this.service;
    }

}
```

## 3 通用Mapper

### 3.1 基础通用Mapper

依赖开源工程通用Mapper实现，实现基本增删改查。见文档[Mapper3通用接口大全](http://git.oschina.net/free/Mapper/blob/master/wiki/mapper3/5.Mappers.md)。

**必须仔细查看该文档，重点需要区分有无Selective方法的区别。**

除非必要，所有方法都需要使用带Selective的方法，如insertSelective、updateXXXSelective等。

### 3.2 拓展方法

- selectBy(Object... args): 根据指定参数进行查询，返回所有查询结果。参数格式为参数名1，参数值1，参数名2，参数值2...（字段名尽量使用model中生成的常量，支持orderBy查询，例：	         sysUserMapper.selectBy(SysUser.f_enable, 1, SysUser.f_status, 0, "orderBy", "name asc, status desc")）;
- selectOneBy(Object... args): 根据指定参数进行查询，返回一条记录，如果返回结果有多条记录，则进行报错。参数格式同selectBy;
- selectForUpdate(Object... args): 根据指定参数进行查询，同时将会锁定表。参数同selectBy;
- selectOneForUpdate(Object... args)：根据指定参数进行查询，同时将会锁定表。参数同selectBy;
- selectByPrimaryKeyForUpdate(Object key): 根据主键ID进行查询，并锁定记录，参数为主键值。
- deleteBy(Object... args): 根据指定参数进行删除。参数格式为参数名1，参数值1，参数名2，参数值2... （例：sysUserMapper.deleteBy(SysUser.f_enable, 1, SysUser.f_status, 0)）

## 4 异常信息翻译

​	实现对异常翻译信息的模版翻译，支持常规字符串替换、数据字典翻译以及依据表动态数据翻译。通过对异常信息进行模版配置，且在异常对象中设置值实现。

### 4.1 功能介绍

#### 4.1.1 字符串模版替换

​	异常信息字符串替换。

代码示例：

```java
/**
 * 异常信息字符串模版替换
 */
@Test
public void testCommon() {
  throw new SystemException("{code}错误").set("code", "admin");
}
```

#### 4.1.2 数据字典模版

​	根据数据字典进行异常信息翻译。相对于字符串替换，set方法参数3为模版配置中的模版key。

代码示例：

```java
/**
 * 异常信息数据字典翻译
 */
@Test
public void testTemplateDict() {
  throw new SystemException("{testDict}无权限").set("testDict", 1, "test1");
}
```

#### 4.1.3 表动态数据模版

​	根据表动态数据进行异常信息翻译。相对于字符串替换，set方法参数3为模版配置中的模版key。

代码示例：

```java
/**
 * 异常信息普通表翻译
 */
@Test
public void test1TemplateCommon() {
  throw new SystemException("{userId}无权限").set("userId", "1", "sysUser");
}
```

#### 4.1.4 组合翻译

代码示例：

```java
/**
 * 异常信息组合翻译
 */
@Test
public void testGroup() {
  throw new SystemException("{code}错误，{userId}无权限，{testDict}错误")
    .set("code", "admin")
    .set("userId", "1", "sysUser")
    .set("testDict", 1, "test1");
}
```

### 4.3 使用方式

​	通过在``系统设置-基础信息-消息模版``界面配置模版以支持数据字典模版和表动态数据模版翻译。

#### 4.3.1 模版配置

##### 数据字典模版

注意事项：

- 消息模版名全局唯一
- 翻译类型选择静态
- dictKey对应在数据字典中配置的静态数据字典key

##### 表动态数据模版

注意事项：

- 消息模版名全局唯一
- 翻译类型选择动态
- 表名对应需要获取翻译信息的表名
- 表字段对应异常信息中的真实值表示字段
- 翻译字段对应真实值进行翻译后的显示值字段

## 5 测试支持

​	框架封装了三种测试方式的支持：Url请求测试、基于Spring测试和基于Mockito测试。

​	使用Url请求测试时，依赖配置文件applicationContext.xml和spring-mvc.xml。

​	使用基于Spring的测试，依赖配置文件applicationContext.xml。

### 5.1 Url请求测试

​	通过简单的测试代码编写，完成后端从url映射到逻辑测试的全流程自测。无需依赖前端界面测试。测试过程将会在后端打印完整日志，包含请求url、请求数据和响应数据。

#### 5.1.1 使用方式

1. 增加配置文件applicationContext.xml和spring-mvc.xml
2. 继承BaseWebTest
3. 定义基础URL
4. 支持设置用户模拟信息，当程序中需要获取当前用户信息时，可以通过该方法进行模拟
5. Get（Post、Put和Delete也支持）请求测试可以通过setParam方式设置请求参数
6. Post、Put、Delete请求测试可以在对应的doXXX方法时加入请求体数据

#### 5.1.2 代码示例

```java
/**
 * 模拟请求测试示例
 */
public class SysUserControllerTest extends BaseWebTest {
    /**
     * 对应后端Controller上定义的url
     */
    private static final String URL = "/api/v2/users";

    /**
     * 模拟用户数据
     * 系统在执行过程中某些部分需要依赖用户数据，可以通过该方法实现模拟
     */
    @Before
    public void setUp() {
        JwtData userInfo = new JwtData();
        userInfo.setId(10021L);
        userInfo.setCode("admin");

        ThreadLocalUtil.setJwtData(userInfo);
    }

    /**
     * 获取用户信息
     * 模拟查询测试
     */
    @Test
    public void testGetUser() {
        doGet(URL + "/1");
    }

    /**
     * 获取用户组长测试
     * 模拟查询测试，并设置查询参数
     */
    @Test
    public void testGetUserLeader() {
        // 设置请求参数，对应requestParam中的参数
        setParam(SysUser.f_companyId, 1);
        doGet(URL + "/1/leaders");
    }

    /**
     * 测试新增用户
     * 模拟post请求增加数据
     * 示例：有无请求体
     */
    @Test
    public void testAddUser() {
        // post请求，无参数
        doPost(URL);

        // post请求，需要加入参数，对应requestBody中的参数
        AddUserInParam sysUser = new AddUserInParam();
        sysUser.setCode("user");
        sysUser.setLoginPassword("密码");
        sysUser.setCompanyId(1L);
        sysUser.setName("123");
        doPost(URL, sysUser);
    }

    /**
     * 测试修改用户
     * 模拟put请求修改数据
     * 示例：有无请求体
     */
    @Test
    public void testUpdateUser() {
        // put请求，无参数
        doPut(URL + "/1");

        // put请求，需要加入参数，对应requestBody中的参数
        SysUser sysUser = new SysUser();
        sysUser.setId(66L);
        sysUser.setLoginName("测试123");
        sysUser.setName("用户");
        doPut(URL + "/1", sysUser);
    }

    /**
     * 测试删除用户
     * 模拟delete请求删除数据
     * 示例：有无请求体
     */
    @Test
    public void testDeleteUser() {
        // delete请求，无参数
        doDelete(URL + "/1");

        // delete请求，需要加入参数，对应requestBody中的参数
        doDelete(URL + "/1", new Object());
    }

}
```

### 5.2 基于Spring测试

​	测试依赖Spring框架，依赖配置文件applicationContext.xml。

#### 5.2.1 使用方式

- 继承BaseTest类
- 增加配置文件applicationContext.xml

#### 5.2.2 代码示例

```java
/**
 * 用户管理dao测试类
 * @author leo
 *
 */
@Transactional
@Rollback
public class SysUserMapperTest extends BaseTest {
	
	@Autowired
	SysUserMapper dao;
	
	/**
	 * 测试根据用户名查询用户
	 */
	@Test
	public void testGetUserByName() {
		dao.getUserByName("测试");
	}
	
	/**
	 * 测试根据用户ID列表查询用户
	 */
	@Test
	public void testFindByUserIds() {
		dao.findByUserIds("1,2");
	}
	
	/**
	 * 测试模糊查询用户
	 */
	@Test
	public void testFuzzySearchUser() {
		dao.fuzzySearchUser("测试");
	}
}
```

### 5.3 基于Mockito测试

​	基于Mockito测试，模拟依赖服务，入参等。具体规则参考文档[**mockito** ](https://github.com/mockito/mockito/wiki)。

#### 5.3.1 使用方式

- 继承BaseMockitoTest类

#### 5.3.2 代码示例

```java
public class SysUserServiceImplTest extends BaseMockitoTest {
	
	@Mock
	SysUserMapper dao;
	@InjectMocks
	SysUserService service;
	
	@Before
	public void setUp() {
		service = new SysUserServiceImpl();
	}
	
	/**
	 * 新增用户测试
	 */
	@Test
	public void addUser() {
		int id = 1;
		
		SysUser sysUser = new SysUser();
		sysUser.setUserId("test@test.com");
		sysUser.setLoginName("用户测试");
		sysUser.setLoginPassword("密码");
		sysUser.setDeptId(1);

		when(dao.insertSelective(sysUser)).thenReturn(id);
		int rsId = service.addUser(sysUser);
		assertSame(id, rsId);
		
	}
	
	/**
	 * 根据用户Id获取用户信息
	 * 
	 * @return
	 */
	@Test
	public void getUser() {
		int id = 1;
		
		SysUser sysUser = new SysUser();
		sysUser.setId(id);
		sysUser.setUserId("test@test.com");
		sysUser.setLoginName("用户测试");
		sysUser.setLoginPassword("密码");
		sysUser.setDeptId(1);
		
		when(dao.selectByPrimaryKey(id)).thenReturn(sysUser);
		SysUser user = service.getUser(id);
		
		assertSame(sysUser, user);
	}

	/**
	 * 测试模糊搜索用户
	 */
	@Test
	public void fuzzySearchUser() {
		SysUser user1 = new SysUser();
		user1.setId(1);
		user1.setUserId("test1@test.com");
		user1.setLoginName("测试用户1");
		
		SysUser user2 = new SysUser();
		user2.setId(2);
		user2.setUserId("test2@test.com");
		user2.setLoginName("测试用户2");
		
		List<Map<String, String>> users = new ArrayList<Map<String,String>>();
		users.add(JSONObject.parseObject(JSON.toJSONString(user1), Map.class));
		users.add(JSONObject.parseObject(JSON.toJSONString(user2), Map.class));
		
		when(dao.fuzzySearchUser("测试")).thenReturn(users);
		
		List<Map<String, String>> rsUsers = service.fuzzySearchUser("测试");
		assertArrayEquals(users.toArray(), rsUsers.toArray());
	}
	
	/**
	 * 测试更新用户信息
	 */
	@Test
	public void updateUser() {
		SysUser sysUser = new SysUser();
		sysUser.setId(1);
		sysUser.setLoginName("测试用户");
		sysUser.setUserName("修改后");
		
		when(dao.updateByPrimaryKeySelective(sysUser));
		service.updateUser(sysUser);
	}

	
	/**
	 * 测试删除用户信息
	 */
	@Test
	public void deleteUser() {
		int id = 1;
		SysUser user = new SysUser();
		user.setId(id);
		user.setStatus(0);
		
		when(dao.updateByPrimaryKeySelective(user)).thenReturn(1);
		service.deleteUser(id);
	}
}
```