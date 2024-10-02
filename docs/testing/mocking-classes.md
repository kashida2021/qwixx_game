# Mocking Classes With Jest and TypeScript

Mocking with Jest and TypeScript can be quite annoying as it requires a lot of boilerplate code. 
I spent 2 days trying out different approaches and will document them here. 

So far I've found 4 ways to mock classes and stub their methods. 

- Partial`<T>` - [example](./mocking-class-with-partial.md)
- Extending base class and overiding methods - [example](./mocking-class-with-extend.md)
- jest.Mocked`<T>` - [implemented](../../server/src/tests/services/QwixxLogic.unit.test.ts)
- jest.mock('path/to/file') and jest.MockedClass`<T>` - [example](./mocking-class-with-jest-MockedClass.md)


## Partial`<T>`
- Creates a light copy of the class.
- Sets all properties of the base class to any type.
- If the class that depends upon a method that hasn't been mocked in the mocked class, it'll cause errors. This means you'll need to make sure you mock the relevant properties which can lead to more boilerplate code, lower maintainability, and brittle tests.
- Limited use case. Only good for simple tests and where class dependencies are simple.

```TypeScript
const classMock: Partial<T> = {
    name: "some name",
    prop: true, 
    otherProp: {
        key: "value",
        key2: "value2",
    }
    method: jest.fn(),
}
```

## Extending base class
- Quite easy to set up as you only need to extend the base class.
- You can overwrite base class methods, effectively creating stubs.
- You can also quite effectively stub getter methods though it results in a lot of boiletplate.
- Changes to the base class can affect the mock.
- Needs good knowledge of the base class implementation as there can be side effects from the class's properties.

```TypeScript
const classMock extends baseClass {
    method = jest.fn();

    get property(): <T>{
        return {
            prop: val,
        }
    }
}

classMock.method.mockReturnValue(value);
```

## jest.Mocked`<T>`
- The prefered choice.
- Creates a mock of an instance of a class.
- A good balance of maintainability and mocking ability.
- It should turn all methods into jest.fn() which means if don't have to account for all class properties/methods when setting up the mocks.
- You'll still need to write **jest.fn()** in the set up so that TypeScript knows that you're trying to mock the method.
- Changes to the base class shouldn't affect the mock too much.

```TypeScript
const classMock = new Class() as jest.Mocked<Class>
//If you want to set up a global return value for all test cases
classMock.method = jest.fn().mockReturnValue(value);

//If you want to assign the method as a mockFn.
classMock.method = jest.fn()
//In your test cases
classMock.method.mockReturnValue(value);

```


## jest.mock() & jest.MockedClass`<T>`
- Using jest.mock() completely mocks the module or class.
- Use when you also need control over the class's construtor.
- As everything in the class is mocked, you need to create implementations for all properties making it very convoluted. 
- You can't use **jest.spyOn()** on **getter** or **setter** methods as they are completely overidden by **jest.mock()** so you'll have to implement yourself.
- Difficult to maintain in my opinion. 

```TypeScript
jest.mock("path/to/mock");

//Note we're mocking the base class and not an instance of the class
const MockedClass = Class as jest.MockedClass<typeof T>;
MockedClass.mockImplementation(function (
    this: any, 
    prop1: T, 
    prop2: T
){
    this.prop1 = prop1;
    this.prop2 = prop2;
    this.method = jest.fn();
    // Set up a private variable to mimic a private property of the base class
    let _privateVariable = 0;

    // Use 'Object.defineProperty' to set up a getter method
    Object.defineProperty(this, "privateVariable", {
        get: jest.fn(() => _privateVariable),
        configurable: true,
    })

    return this;
})
```

## Notes about Getters & Setters
From all my investigations, it seems like the easiest way to stub the return value for getter methods is by using **jest.spyOn()**. So you will likely use a combination of mocking a class and spying a **getter** or **setter** method. 

Remember, it won't work if you use the combination of **jest.mock()** and **jest.MockedClass`<T>`**.

You can do it like so, as per the Jest documentation:

```TypeScript
jest.spyOn(class, "method", "get).mockReturnValue(valueToReturn);
```

 