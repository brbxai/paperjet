#!/bin/sh
/app/db/dbmigrate
exec node server.js