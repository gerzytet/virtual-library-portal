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

    await test.addBook(new Book("title", "author", "publisher", 2021, "222-1234567890", "category"))
    assert((await test.getBookCollection()).length === 1)
    assert((await test2.getBookCollection()).length === 0)

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
