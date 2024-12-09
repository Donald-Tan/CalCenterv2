#!/bin/bash
set -e

mysql.server stop

for i in {1..5}
do
  num=$((5 - i + 1))
  echo "$num..."
  sleep 1
done

brew services stop mysql

echo "All MySQL services stopped"
echo ":D Tasks complete!"