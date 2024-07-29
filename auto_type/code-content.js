const codePhp = `<?php

class User
{
    public function __construct(
        private string $name,
    ) {}

    public function getName(): string
    {
        return $this->name;
    }

    public function sayHello(): void
    {
        echo $this->getName().' said: Hello mother fucker!!!';
        echo 'What the fuck are you looking for?';
    }
}

// Create a new instance of the User class.
$nam = new User('Nam');

// Call sayHello method to display the text on the screen.
$nam->sayHello();

`;

const codeJs = `'use strict';

class User {
  constructor(name) {
    this.name = name;
  }
  
  getName() {
    return this.name;
  }

  sayHello() {
    console.log(this.name + ' said: Hello mother fucker!!!');
    console.log('What the fuck are you looking for?');
  }
}

const nam = new User('Nam);
nam.sayHello();

`;

const codeCpp = `#include <iostream>
#include <string>
using namespace std;

class User {
    private:
        string name;
    public:
        User(string name) {
          this->name = name;
        };
        string getName() {
          return this->name;
        };
        void sayHello() {
          cout << name << " said: Hello mother fucker!!!" << endl;
          cout << name << "What the fuck are you looking for?";
        };
};

int main() {
    User nam("Nam");
    nam.sayHello();
    return 0;
}

`;
