Can consider refactoring to use a custom hook or useContext() api for socket events

The better way with error handling:
```javascript
const connectSocket = async () => {
    try {
     await socketService.connect("http:ocalhost:3001");
     setIsLoading(true);
    } catch (err) {
     console.error("Failed to connect to server", err);
    }
   };
```
   