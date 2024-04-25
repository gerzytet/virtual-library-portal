import { get } from 'http'
import { getClient, validateBook, findUsernameByEmail, addPendingUser, confirmRegistration, User, Book, checkCredentials, getUser, initDatabaseConnection, isUsernameAvailable, createUser, validateUserData } from './data_interface.mjs'
import assert from 'assert'

async function testUserFunctions() {
    assert(!await checkCredentials("test", "password"))
    assert(await isUsernameAvailable("test"))
    assert(await findUsernameByEmail("test@example.com") === null)
    await createUser("test", "test@example.com", "password")
    assert(await checkCredentials("test", "password"))
    assert(!await isUsernameAvailable("test"))
    assert(await findUsernameByEmail("test@example.com") === "test")
    await getUser("test").setPassword("password2")
    assert(!await checkCredentials("test", "password"))
    assert(await checkCredentials("test", "password2"))

    await addPendingUser("test2", "test2@example.com", "password")
    assert(!await isUsernameAvailable("test2"))
    await confirmRegistration("test2")
    await confirmRegistration("doesn't exist")
    assert(!await isUsernameAvailable("test2"))

    assert(!validateUserData("goodusername", "bademail", "password"))
    assert(!validateUserData("goodusername", "bad@email", "password"))
    assert(!validateUserData("goodusername", "bad.email", "password"))
    assert(!validateUserData(undefined, undefined, undefined))
    assert(!validateUserData("goodusername", "email@example.com", ""))
    assert(!validateUserData("", "email@example.com", "password"))
    assert(!validateUserData("username", "", "password"))

    assert(validateUserData("username", "email@example.com", "password"))

    console.log("User functions: passed")
}

async function testBookFunctions() {
    let test = getUser("test")
    let test2 = getUser("test2")

    await test.addBook(new Book("title", "author", "publisher", "2021", "222-1234567890", "category"))
    assert((await test.getBookCollection()).length === 1)
    assert((await test2.getBookCollection()).length === 0)
    assert((await test.searchBookCollection(new Book("title","","","","",""))).length === 1)
    assert((await test.searchBookCollection(new Book("squirtle","","","","",""))).length === 0)
    assert((await test.searchBookCollection(new Book("itl","","","","",""))).length === 1)
    assert((await test.searchBookCollection(new Book("","aut","","","",""))).length === 1)
    assert((await test.searchBookCollection(new Book("","","pub","","",""))).length === 1)
    assert((await test.searchBookCollection(new Book("","","","2021","",""))).length === 1)
    assert((await test.searchBookCollection(new Book("","","","","222-",""))).length === 1)
    assert((await test.searchBookCollection(new Book("","","","","","ateg"))).length === 1)
    assert((await test.searchBookCollection(new Book("","","","","","ATEG"))).length === 1)
    let id = (await test.getBookCollection())[0].id
    await test.editBook(id, new Book("title2", "author2", "publisher2", "2022", "222-1234567891", "category2"))
    assert((await test.getBookCollection())[0].title === "title2")
    assert((await test.getBookCollection())[0].author === "author2")
    assert((await test.getBookCollection())[0].publisher === "publisher2")
    assert((await test.getBookCollection())[0].year === 2022)
    assert((await test.getBookCollection())[0].isbn === "222-1234567891")
    assert((await test.getBookCollection())[0].category === "category2")
    id = (await test.getBookCollection())[0].id
    await test.removeById(id)
    assert((await test.getBookCollection()).length === 0)

    let valid = [
        new Book("title", "author", "publisher", '2021', "222-1234567890", "category"),
        new Book("title", "", "", '', "", ""),
        new Book("title", "", "", '1002', "", "category"),
        new Book("!@#$%", "_____", "*#**993", '6', "222-1234567890", "Cadd[][][]"),
    ]

    let invalid = [
        new Book(undefined, "", "", '', "", ""),
        new Book("", "author", "publisher", "2021", "222-1234567890", "category"),
        new Book("title", "author", "publisher", "yEER", "222-1234567890", "category"),
        new Book("title", "author", "publisher", "2021", "sussy isbn", "category"),
        new Book("title", "author", "publisher", "2021", "222_1234567890", "category"),
        new Book("title", "author", "publisher", "2021", "2221234567890", "category"),
        new Book("title", "author", "publisher", "2021", "222-123456789", "category"),
        new Book("title".repeat(100), "author", "publisher", "2021", "222-123456789", "category"),
        new Book("title", "author".repeat(100), "publisher", "2021", "222-123456789", "category"),
        new Book("title", "author", "publisher".repeat(100), "2021", "222-123456789", "category"),
        new Book("title", "author", "publisher", "2021", "222-123456789", "category".repeat(100)),
        new Book("title", undefined, "publisher", "2021", "222-123456789", "category"),
        new Book("title", "author", undefined, "2021", "222-123456789", "category"),
        new Book("title", "author", "publisher", "2021", undefined, "category"),
        new Book("title", "author", "publisher", "2021", "222-1234567890", undefined),
        new Book("title", "author", "publisher", undefined, "222-1234567890", undefined),
    ]

    for (let book of valid) {
        assert(validateBook(book))
    }

    for (let book of invalid) {
        assert(!validateBook(book))
    }

    console.log("Book functions: passed")
}


async function runTests() {
    initDatabaseConnection()
    await getClient().query('DELETE FROM Books;')
    await getClient().query('DELETE FROM Users;')
    await testUserFunctions()
    await testBookFunctions()

    console.log("finished tests!")
}

await runTests()
