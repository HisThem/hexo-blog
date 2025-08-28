---
title: C++教程 | 25.基于STL的编程
date: 2024-12-02 14:08:35
tags: [C++, 系统性教程]
categories:
    - 系统性教程
    - C++高级程序设计
---
## 什么是STL？
- C++保留了C的标准库，另外还提供了一个基于模板实现的标准模板库（Standard Template Library，简称STL）：
	- 实现了一些面向序列数据的表示及常用的操作。
	- 支持了一种抽象的编程模式，该模式隐藏了一些低级的程序元素，如数组、链表、循环等，使得编程效率更高。
- STL由多人参与设计，C\+\+设计者更看重C\+\+的基于STL的编程。这些年的C++更新，主要是扩充了C\+\+的模板库。
## STL包含什么？
- **容器**
	- 用于存储序列化的数据元素，如：向量、队列、栈等。
- **算法**
	- 用于实现对容器中的数据元素进行一些常用的操作，如：查找、排序、统计、求和等一系列算术运算。
- **迭代器**
	- 属于一种**智能指针**，它们指向容器中的数据元素，用于对容器中的数据元素进行遍历和访问。
	- 迭代器是容器和算法之间的**桥梁**：传给算法的不是容器，而是指向容器中元素的迭代器，这样使得算法不依赖于具体的容器，从而提高算法的通用性。（使用迭代器有时会让简单的程序显得繁琐，因此C++20保留了迭代器的用法，也增加了直接将容器赋给算法的方式）
## 基于STL编程的例子
从键盘输入一批正整数，然后对它们求最大数、求和、排序、输出
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;
int main() {
	vector<int> v; //创建容器对象v，元素类型为int
	int x;
	cin >> x;
	while (x > 0) {//生成容器v中的元素
		v.push_back(x); //往容器v中增加一个元素
		cin >> x;
	}
}
```

```cpp
//利用算法max_element计算并输出容器v中的最大元素
	cout << "Max = " << *max_element(v.begin(),v.end()) 
		 << endl;
   //利用算法accumulate计算并输出容器v中所有元素的和
	cout << "Sum = " << accumulate(v.begin(),v.end(),0) 
		 << endl;
	//利用算法sort对容器v中的元素进行排序
	sort(v.begin(),v.end()); 
	//利用算法for_each输出排序结果
	cout << "Sorted result is:\n";
	for_each(v.begin(),v.end(), [](int x) { cout << ' ' << x;});
	cout << '\n';
	return 0;
}
```
用STL来实现上述程序的功能不需要涉及一些低级的程序元素，如数组、链表、循环，使得程序设计变得更抽象、便捷和可靠！
## 容器
容器是由同类型元素构成的、长度可变的元素序列。
容器是用类模板来实现的，模板的参数包含了容器中元素的类型。
STL中提供了很多种容器，虽然这些容器都具有一些相同的操作，但由于它们采用了不同的内部实现方法，因此，不同的容器往往适合于不同的应用场合。
### STL的主要容器
**vector<元素类型>**
- 用于需要==快速定位（访问）任意位置上的元素==以及主要在元素序列的==尾部增加/删除元素==的场合。
- 在头文件`vector`中定义，用*动态数组*实现。

**list<元素类型>**
- 用于经常在元素序列中==任意位置上插入/删除元素==的场合。
- 在头文件`list`中定义，用*双向链表*实现。

**deque<元素类型>**
- 用于主要在元素序列的==两端增加/删除元素==以及需要==快速定位（访问）任意位置上的元素==的场合。
- 在头文件`deque`中定义，用*分段的连续空间结构*实现（大体是链表，每个节点内部使用数组）。

**stack<元素类型>**
- 用于仅在元素序列的==尾部增加/删除元素==的场合。
- 在头文件`stack`中定义，基于*deque、list或vector*来实现。

**queue<元素类型>**
- 用于仅在元素序列的==尾部增加==、==头部删除元素==的场合。
- 在头文件`queue`中定义，基于*deque或list*来实现。

**priority_queue<元素类型>**
- 它与queue的操作类似，不同之处在于：每次增加/删除元素之后，它将对元素位置进行调整，使得头部元素总是最大的。也就是说，==每次删除的总是最大==（优先级最高）的元素。
- 在头文件`queue`中定义，基于*deque或vector*来实现。
- 上面三类容器是作为适配器提供的，方便使用。

**map<关键字类型，值类型>** 和**multimap<关键字类型，值类型>**
- 用于需要==根据关键字来访问元素==的场合。
- 容器中每个元素由关键字和值构成（它属于一个pair结构类型，该结构有两个成员：first和second，first对应关键字，second对应值），元素是根据其关键字排序的。
- 对于map，不同元素的关键字==不能==相同；对于multimap，不同元素的关键字==可以==相同。
- 它们在头文件`map`中定义，常常用*某种二叉树*来实现。

**set<元素类型>** 和**multiset<元素类型>**
- 它们分别是map和multimap的特例，每个元素只有关键字而没有值，或者说，关键字与值合一了。
- 在头文件`set`中定义。

**basic_string<字符类型>**
- 与vector类似，不同之处在于其元素为字符类型，并提供了一系列与字符串相关的操作。
- string和wstring分别是它的两个实例：
	- `basic_string<char>`
	- `basic_string<wchar_t>`
		- wchar_t 是 C++ 和 C 编程语言中用来表示宽字符（wide character）的一种数据类型。它设计用于处理比常规字符（char）占用更多存储空间的字符，主要用于支持多种语言的多字节或宽字符编码（如 Unicode）。
- 在头文件`string`中定义。

### 容器的基本操作
容器类提供了一些成员函数来实现容器的基本操作，其中包括：
- 往容器中增加元素
- 从容器中删除元素
- 获取容器中指定位置的元素
- 在容器中查找元素
- ......
这些成员函数往往具有通用性（大部分容器类都包含它们）。

注意：如果容器的元素类型是一个**类**，则针对该类可能需要：
- *自定义拷贝构造函数*和*赋值操作符重载函数*
	- 容器内部进行的一些操作中可能会创建新的元素（对象的拷贝构造）或进行元素间的赋值（对象赋值）。
- *重载小于操作符（<）*
	- 容器内部进行的一些操作中可能要对元素进行“小于”比较运算。
### 例：利用容器vector来实现序列元素的存储与处理（不采用STL的算法）
```cpp
#include <iostream>
#include <vector>
using namespace std;
int main(){
	vector<int> v; //创建一个vector类容器对象v
	int x;
	cin >> x;
	while (x > 0){ //循环往容器v中增加正的int型元素
		v.push_back(x); //往容器v的尾部增加一个元素
		cin >> x;
	}
	
	//求容器中所有元素的和以及最大与最小元素
	int sum=0,max,min;
	max = min = v[0];
	for (int n: v) //遍历容器元素（C++11）
	{ sum += n;
	  if (n < min) min = n;
	  else if (n > max) max = n;
	}
	cout << "sum=" << sum << ",max=" 
		  << max << ",min="  << min << endl;
	return 0;
}
```

### 例：利用容器map来实现电话号码簿功能
```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;
int main()
{ map<string,int> phone_book; //创建一个map类容器，
	//用于存储电话号码簿(由姓名和电话号码构成)，姓名是关键字
  //创建电话簿
  pair<string,int> item; //pair<string,int>是phone_book的元素类型
  item.first = "wang"; item.second = 12345678;
  phone_book.insert(item); //在容器phone_book中增加一个元素
  item.first = "li"; item.second = 87654321;
  phone_book.insert(item); //在容器phone_book中增加一个元素
  item.first = "zhang"; item.second = 56781234;
  phone_book.insert(item); //在容器phone_book中增加一个元素
  ......

//输出电话号码簿
	cout << "电话号码簿的信息如下：\n";
	for (pair<string, int> item: phone_book)
	cout << item.first << ": " << item.second << endl; 
                                //会按姓名排序输出元素的姓名和电话号码
  //查找某个人的电话号码
  string name;
  cout << "请输入要查询号码的姓名：";
  cin >> name;
  map<string,int>::const_iterator it; //创建一个指向元素的迭代器
  it = phone_book.find(name); //查找关键字为name的容器元素
  if (it == phone_book.end()) //没找到
     cout << name << ": not found\n"; //未找到
  else //找到
     cout << it->first << ": " << it->second << endl; //找到
  
  return 0;
}
```

程序也可以写成：
```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;
int main()
{ map<string,int> phone_book; //创建一个map类容器，
				          //用于存储电话号码簿
  //创建电话簿
  phone_book["wang"] = 12345678; //map重载了操作符[]，可用关键字作为下标往容器中加入元素，如果相应关键字的元素已存在，则是修改对应的值
  phone_book["li"] = 87654321;
  phone_book["zhang"] = 56781234;
  ......


	//输出电话号码簿
  cout << "电话号码簿的信息如下：\n";
  for (auto item: phone_book)  //自动类型推导
    cout << item.first << ": " << item.second << endl;//会按姓名排序输出元素的姓名和电话号码
  //查找某个人的电话号码
  string name;
  cout << "请输入要查询号码的姓名：";
  cin >> name;
  auto it = phone_book.find(name); //查找关键字为name的容器元素
  if (it == phone_book.end()) //没有找到
     cout << name << ": not found\n"; //未找到
  else //找到
     cout << it->first << ": " << it->second << endl; //找到
  
  return 0;
}

```

### string的基本操作
在C++标准库中还提供了一个基于字符数组实现的字符串类型string：
```cpp
#include <string>
```
string会自动管理字符串的内存空间，并提供了字符串的基本操作：

变量的定义和初始化
```cpp
string s1("1234"),s2(s1),s3; 
```

取元素
```cpp
s1[i]
```

取长度
```cpp
s1.length()
s1.size()
```

输入/输出
```cpp
cin >> s1;
cout << s2;
```

拷贝
```cpp
s3 = "abcd"; //把"abcd"复制到s3中
```

拼接
```cpp
s1 += s3; //把s3拼接到s1上
s3 = s1 + s2; //把s1和s2拼接起来给s3
```

比较
```cpp
... s1 < s2 ...
```

子串查找
```cpp
s1.find(s2)     //从s1的头开始查找s2，返回找的位置或string::npos（未找到）
s1.find(s2,i)   //从s1的位置i开始查找s2，返回找到的位置或string::npos（未找到）
```

子串替换
```cpp
s1.replace(i,count,s2) //把s1中从位置i开始的count个字符替换成s2
```

## 迭代器
迭代器（iterator）属于一种**智能指针**，它们指向容器中的元素，用于对容器中的元素进行访问和遍历。
在STL中，迭代器是作为类模板来实现的（在头文件iterator中定义），它们可分为以下几种类型：
- **输出迭代器**（output iterator，记为：OutIt）
	- ==只能修改==它所指向的容器元素
	- 间接访问(`*`)
	- `++`
- **输入迭代器**（input iterator，记为：InIt）
	- ==只能读取==它所指向的容器元素
	- 间接访问（`*`）和元素成员间接访问（`->`）
	- `++`、` == ` 、`!=`。
- **前向迭代器**（forward iterator，记为：FwdIt）
	- ==可以读取/修改==它所指向的容器元素，只能++，不能--
	- 元素间接访问（`*`）和元素成员间接访问（`->`）
	- `++`、` == `、`!=`
- **双向迭代器**（bidirectional iterator，记为：BidIt）
	- `可以读取/修改`它所指向的容器元素，可以++和--
	- 元素间接访问（`*`）和元素成员间接访问（`->`）
	- `++`、`--`、` == `、`!=`操作
- **随机访问迭代器**（random-access iterator，记为：RanIt）
	- ==可以读取/修改==它所指向的容器元素
	- 元素间接访问（`*`）、元素成员间接访问（`->`）和下标访问元素（`[]`）
	- `++`、`--`、`+`、`-`、`+=`、`-=`、` == `、`!=`、`<`、`>`、`<=`、`>=`
**注意**：指向数组元素的普通指针可以看成是随机访问迭代器
### 各容器允许的迭代器类型
由于采用了不同的内部实现，因此，不同的容器所提供的迭代器类型会有所不同：
- 对于`vector`、`deque`以及`basic_string`容器类，与它们关联的迭代器类型==只能为随机访问迭代器==（RanIt）
- 对于`list`、`map/multimap`以及`set/multiset`容器类，与它们关联的迭代器类型==只能为双向迭代器==（BidIt）。
- `queue`、`stack`和`priority_queue`容器类，==不支持迭代器==
可通过容器类的成员函数`begin`和`end`等获得容器的**首尾迭代器**。
### 迭代器之间的相容关系
迭代器类型之间存在下面的相容关系：
![[Pasted image 20241125163641.png]]
在需要箭头左边迭代器的地方可以用箭头右边的迭代器去替代。

### 例：利用STL的容器list和迭代器实现求解约瑟夫问题
*约瑟夫（Josephus）问题*：有N个小孩（编号为0～N-1）围坐成一圈，从某个小孩开始顺时针报数（1、2、...），报到M的小孩从圈子离开，然后，从下一个小孩开始重新报数，每报到M，相应的小孩从圈子离开，......，最后一个离开圈子的小孩为胜者，问胜者是哪一个小孩？
```cpp
#include <iostream>
#include <list>
using namespace std;
int main() {
	int m,n; //m用于存储要报的数，n用于存储小孩的个数
	cout << "请输入小孩的个数和要报的数：";
	cin >> n >> m;
	//构建圈子
	list<int> children; //children是用于存储小孩编号的容器
	for (int i=0; i<n; i++) //循环创建容器元素
		children.push_back(i); //把小孩的编号（i）从容器尾部放入容器
	//开始报数
	list<int>::iterator current; //current为指向容器元素的迭代器
	current = children.begin(); //current初始化成指向容器的第一个元素
	while (children.size() > 1) {//只要容器元素个数大于1，就执行循环
		for (int count=1; count<m; count++)  {//报数，循环m-1次
			current++; //current指向下一个元素（list的迭代器重载了++）
			//如果current指向的是容器末尾，current指向第一个元素
			if (current == children.end()) current = children.begin();
       }
       //循环结束时，current指向将要离开圈子的小孩
		current = children.erase(current);  //小孩离开圈子，current指向下一个元素
		//如果current指向的是容器末尾，让current指向第一个元素
       if (current == children.end()) current = children.begin();
   } //循环结束时，current指向容器中剩下的唯一的一个元素，即胜利者
   //输出胜利者的编号
	cout << "The winner is No." << *current << "\n";
	return 0;
}

```
上面程序中的list也可以换成vector，但由于需要经常在容器的任意位置上删除元素，而list容器的双向链表结构使得这个操作的效率高一些！
## 算法
在STL中，除了用容器类自身提供的成员函数来操作容器元素外，还提供了一系列通用的对容器中元素进行操作的**全局函数**，称为算法（algorithm）。
STL算法实现了对序列元素的一些常见操作，主要包括：
- 调序算法
- 编辑算法
- 查找算法
- 算术算法
- 集合算法
- 堆算法
- 元素遍历算法
算法是用函数模板实现的，除了算术算法在头文件`numeric`中定义外，其它算法都在头文件`algorithm`中定义。

大部分STL算法都是遍历指定容器中某范围内的元素，对满足条件的元素执行某项操作。
例如：
```cpp
bool f(int x) { return x > 0; }
vector<int> v;
...... //往容器中放了元素
cout<<count_if(v.begin(),v.end(),f); //统计v中正数的个数
```
另外，如果容器中的元素是自定义类的对象，则针对相应的类可能要重载一些操作符（如<、==、=等），因为有些算法内部会用到这些操作。

