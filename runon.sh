#!/usr/bin/env bash
# Run script on remote server

# process command and its flags
# leading colon to suppresses error message for invalid flag
# trailing colon indicates flag requires argument
while getopts ":s:f:h" opt; do
	case "$opt" in
		s) HOST="$OPTARG";;
		f) FILE="$OPTARG";;
		h) cat <<- _EOF_
		Usage: runon [-s server] [-f filename]
		Options:
		  -h help   : this help
		  -s server : Host name that you configured in your ~/.ssh/config file (see down below)
		  -f file   : executable file
		OR:
		  u can use the script w/out flags, then u'll be prompted for host name and file
		**NOTE** :
		  before you run the script make sure u have the following in '~/.ssh/config' file:
		    Host web-01
		      Hostname <web-01-ip>
		      IdentityFile <path-to-private-key-file>
		      User ubuntu
		    Host web-02
		      Hostname <web-02-ip>
		      IdentityFile <path-to-private-key-file>
		      User ubuntu
		    Host balancer
		      Hostname <load-balancer-ip>
		      IdentityFile <path-to-private-key-file>
		      User ubuntu
_EOF_
exit;;
		\?) echo "Invalid option -$OPTARG";;
	esac
done

if [[ -n $HOST && $FILE ]]; then
	[ ! -x "$FILE" ] && echo -e "${COLOR_RED}file does not have execute permissions${RESET}" && exit 1
	echo -e "${COLOR_CYAN}Processing...${RESET}"
	ssh "$HOST" 'sudo bash -s' < "$FILE"
	[ "$?" -eq 0 ] && echo -e "${COLOR_GREEN}Done!${RESET}"
	exit "$?"
fi

[ -z "$HOST" ] && read -rp "host name -> " HOST
[ -z "$FILE" ] && read -rp "script file to execute -> " FILE

[ ! -x "$FILE" ] && echo -e "${COLOR_RED}file does not have execute permissions${RESET}" && exit 1

echo -e "${COLOR_CYAN}Processing...${RESET}"
ssh "$HOST" 'sudo bash -s' < "$FILE"
[ "$?" -eq 0 ] && echo -e "${COLOR_GREEN}Done!${RESET}"
