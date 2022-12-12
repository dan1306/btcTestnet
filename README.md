# eval2021

A simple application by which a user can send some currency
(testnet bitcoin) from one wallet to another.

### Technologies used

Blockcypher API, React, Mongoose, Express, Node, Bootstrap, bcrypt, jsonwebtoken

### Summary

This application is centered around the use of BTC-TESTNET and employs the Bockypher API and token to create addresses, create wallets associated to a particular address, make transaction to public addresses, and view details of a particular public address.  

Before using the application, it is best to define your token, SECRET (your secert could be anything), and SALT_ROUNDS in your.env, you can get your token by registering for an account on blockcypher. 

While using this application it is best to not make too many requests at a time, to prevent being restricted to access of data.   

For the best user experience follow these: 

2000 Requests Per Day 

200 Requests Per Hour 

3 Requests Per Second

### Intro

Designed with Bootstrap this is an application where users can create multiple Btc-TestNet addresses and corresponding wallets, all bound to an individual account. 

Btc-TestNet is a separate blockchain from actual Bitcoin. It holds no value and is used for testing purposes.

### Logging In And Signing Up

Before a user can do anything on the website they will either need to log in or signup. For now, all other routes does not exist from a users point of view without logging in or signing up.

When signing up, passwords are not stored in the database as plain text, rather with the help of bcrypt your passwords are hashed meaning encoded into a set of strings and integers, which are decoded and compared to the typed input of your password you provide when logging in. 
<!-- Demonstrate (Create A New Sign Up, And Show Database) -->

Having to reenter credentials every time you return to a site gets annoying, so to fix this issue with the help of a package called Jason web token, upon signing up or logging in, ( apart from your password which are hashed anyways ) all your other credentials are stored in the local storage.

For 24 hours after logging in or signing up your credentials are saved leaving no need to reenter credentials when you return to the site. 
<!-- Demonstrate ( show the token in local storage ) -->

### Logged In View

Once a user has signed up or logged in, they will be directed to a view for searching public addresses and making transactions. This certain route catches any destination searched for which does not exist, and is the route most likely shown to a user upon logging or signing up .

### Create A Wallet

Before searching and making transactions to public addresses you will need to create an address and its wallet.

To do this, click the Wallets dropdown in the navigation and then click create a wallet.

You will be then directed, to a view where you can create a wallet.

If your wallet name exists you will be prompted with an error otherwise if your chosen wallet name does not exist, upon creation you will be directed to click on a button which leads you to all wallets associated with your account. 
<!-- Demonstrate -->

### Your Wallets And Details View

On the view where all your wallets can be found, you can view the details of a given wallet by clicking the button View Details.

### How does view details work

when you hover over view details button with your mouse, that particular wallets address is stored in app.js state.
This adddress stored in state is put to use when you click the view details button.

A different page is shown when there is no wallet address in state of app.js.
<!-- Demonstrate -->

### View details

You can fund a created wallet by visiting a BTC-TestNet faucet online.
<!-- Demonstrate ( fund a wallet, what happens if no wallets are selected on the details view ) -->

In the View Details View like the block cypher explorer, you will have access to your RECEIVED, SENT, and BALANCE BTC-TestNet amount, retrieved with a fetch call to the block cypher API. 

You will have access to a QR code of your public address made possible with the help of react-qr-code, along with your confirmed and unconfirmed transactions.

On zero confirmations it seems like funds are not available for use and considered unconfirmed, but any confirmations greater than 0 seems to be considered confirmed. Generally, a transaction of  6 or more confirmations is considered completed and irreversible.

For this reason on zero confirmations, there is an open lock with a colour red located in the top right section of that specific block's transaction. On one to five confirmations the lock is still opened but the colour turns to dark yellow. On 6 or more confirmations the lock is closed with a green colour.

Like the block cypher explorer, there are plans on adding a view which appears when you click a transactions hash.

### Search And Send

Now to the Search View which can be found in the Search And Send drop-down located in the nav.

In this view, you can look up any BTC-TestNet Public Address.

If the address typed in can't be found an error message is prompted. 
<!-- Demonstrate ( where is the error ) -->

Otherwise, a details page is generated.
<!-- Demonstrate -->

If the given address already exists in the database, details will be updated every thirty minutes otherwise details for a given address are fetched and stored in the database.

If you don't want to wait for details to be updated, you can manually click the update button located below MIN PASSED SINCE LAST UPDATE.
<!-- Demonstrate -->

Lastly, to make a transaction you will find a div ( div is a box-like object ) below the search field and above the details, there you can select the wallet address you want to make a transaction from, and enter the amount you want to send (Your Amount / (10^8) = Amount In BTC). 

The amount to send has to be greater than 0 and less than or equal to a hundred million. 
<!-- (what is the equivalence) equvalent to 1 BTC -->

The wallet address you are sending to and the address you are sending from is already verified to exist, so an error may occur for three reasons when making a transaction.

1) You have made more than three requests per second
2) You don't have enough BTC to send
3) You don't have enough to send and cover fees

Other than that you should receive a success message.

While picking a certain address to make a transaction from, you will find the balance of that
particular address below the label 'Inputs Address (Sending From):'. This balance is updated every minute. Please leave time interval of a minimum of 1 sec when going from one address to another address. This will prevent making more than 3 request per seocen to the API and being unable to retreive data for an unknown amount of time.

<!-- Demonstrate A transaction  -->
