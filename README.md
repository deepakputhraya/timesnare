<h1 align='center'>TimeSnare</h1>

Get back in the zone! 

TimeSnare records your screen so that you can replay the work you have done.

### Why use TimeSnare?
If you have ever been in situations where you were doing some deep work & due to some distraction you lost your focus. 
TimeSnare helps you get upto speed. Just before you start working start a session using TimeSnare. 
When you are done with your work just end the sessions. 
When you resume your work you can replay the previous session(s) to get better context of what you were doing. 

### Get Started
**Note**: This only works on OSX

Install:

    yarn global add timesnare

To start a focus session:

    timesnare start

To stop the focus session:
    
    timesnare stop
    
To list all focus sessions:

    timesnare list

To view focus sessions:

    timesnare play <session-id>

### Commands and Options
  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    start                   Start a focus session
    stop                    Stop the current focus session
    terminate               Delete all sessions
    terminate [session-id]  Delete a focus session.
    list                    List all focus sessions
    play [session-id]       Play focus session
    status                  Focus session status
