# Build

```
docker build . -t ctf-jwt-vuln
```

# Run
Replace env var FLAG with desired flag val and run

```
docker run -p 8080:8080 -d -e FLAG='flag{MYAWESOMEFLAG}' --name ctf-jwt-vuln --rm ctf-jwt-vuln
```

# Get container ID
```
docker ps
```

# Print app output
```
docker logs <container id>
```

# App access
Running on http://localhost:8080

# Enter the container
```
docker exec -it <container id> /bin/bash
```

# Stop container
```
docker stop ctf-jwt-vuln
```