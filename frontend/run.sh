set -e
./wait-for-it.sh backend:3000 -t 60 --strict
sleep infinity
