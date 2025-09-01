set -e
./wait-for-it.sh backend:3000 -t 60 --strict
http-server dist/browser -p 4200 -P http://localhost:4200?
sleep infinity
