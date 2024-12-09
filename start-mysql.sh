#!/bin/bash
set -e

brew services start mysql
mysql.server start && mysql -u root -p FitnessTrackDB &

# Begin the frontend/backend server startup
./start-servers.sh