Runtime:

The overall run time fluctuate between 6 seconds to 9 seconds depending on the internet speed.
Because of the nature of this project, which involves hundreds of http calls, the runtime might fluctuate a little depending on your local internet connection and how fast IMDB and Rotten Tomato servers responde to your request.

Module Logic and Breakdown:

I like to seperate different business logic from each other. For example, utils module only involves the http connection and returns the response. This way different team member can work on different parts of the project and not affecting each others' work. In addition, the utils module can easily be reused in a different project. 

Multithreading:

To acheive the maximum efficiency, we need to create a multithread process to speed up the runtime. Although I tried to use a recursive function to retrieve movie list from Rotten Tomato, the speed is siginificantly slower than a multithread process (6 secs vs. 3 secs)

However, when many connections are made to a API, we can easily be rejected because of the account concurrent connection limit. I handled the request failure by a commonly used expontial backoff to retry the request.

In addition, the timeout setting in utils might need to be changed to accomodate for extremely slow internet connection. default 3 seconds



