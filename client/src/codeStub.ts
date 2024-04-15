const stubs: { [key: string]: string } = {};

stubs.java = `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`;

stubs.cpp = `#include <iostream>
#include <stdio.h>
using namespace std;
int main() {
  cout<<"Hello world!\\n";
  return 0;
}
`;

stubs.c = `#include<stdio.h>
int main() {
    printf("Hello World!\\n");
}`;

stubs.py = `print("Hello world!")`;



export default stubs;
