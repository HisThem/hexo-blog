---
title: C++教程 | 4.抽象与封装
date: 2024-09-15 14:02:30
tags: [C++, 系统性教程]
categories:
    - 系统性教程
    - C++高级程序设计
---
抽象与封装是两个重要的程序设计手段，主要是用来**驾驭程序的复杂度**和**提高程序的安全性**，便于==大型程序的设计、理解与维护==。

对于一个程序实体而言，
**抽象**是指该程序实体==外部==可观察到的行为，使用者不考虑该程序实体的内部是如何实现的。（复杂度控制）
**封装**是指把该程序实体==内部==的具体实现细节对使用者隐藏起来，只对外提供一个接口。（信息保护）

主要的程序抽象与封装机制包括：
- 过程抽象与封装
	- 数据表示是公开的，缺乏保护
- 数据抽象与封装
	- 数据的使用者不需要知道数据的具体表现形式，实现了更好的数据保护
### 过程抽象与封装
实现过程抽象与封装的程序实体通常称为**子程序**。在C/C++语言中，子程序用**函数**来表示。

栈的抽象与封装
数据表示：定义栈数据类型
```cpp
const int STACK_SIZE=100;
class Stack
{     
public: //对外的接口（外部可使用的内容）
Stack(); //初始化函数，在声明对象时会自动调用
void push(int e);
void pop(int &e);
private: //隐藏的内容（外部不可使用）
int buffer[STACK_SIZE];
int top;
};
```
然后再单独书写push和pop函数、初始化函数。
```cpp
/* 详细函数内容编写： */
void Stack::push(int e)
   {    if (top == STACK_SIZE-1) 
       {    cout << “Stack is overflow.\n”;
           exit(-1);
       }
       else
       {    top++;  buffer[top] = e;
           return;
       }
   }

void Stack::pop(int &e)
   {    if (top == -1) 
       {    cout << “Stack is empty.\n”;
           exit(-1);
       }
       else 
       {    e = buffer[top]; top--;
           return;
       }
   }
   
Stack::Stack()//初始化函数，在声明对象时会自动调用
{ top = -1; 
}
```
使用该类和方法时：
```cpp
Stack st;  //会自动地去调用st.Stack()对st进行初始化。
int x;
st.push(12);  //把12放进栈st
......
st.pop(x);  //把栈顶元素退栈并存入变量x
......
st.top = -1;  //Error，不能直接操作st！
st.top++;  //Error ，不能直接操作st！
st.buffer[st.top] = 12;  //Error ，不能直接操作st！
st.f(); //Error，f不属于能对st进行的操作！
```

