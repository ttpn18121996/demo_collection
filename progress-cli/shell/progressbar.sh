#!/usr/bin/env bash

BAR_SIZE=40
BAR_CHAR_DONE="="
BAR_CHAR_TODO="-"
BAR_CHAR_END=">"
START_TIME=0

function show_progress {
    current="$1"
    total="$2"

    if [ "$#" -eq 3 ]; then
        BAR_SIZE="$3"
    fi

    if [ $START_TIME -eq 0 ]; then
        START_TIME=$(date +%s)
    fi

    now=$(date +%s)
    rate=$(bc <<< "scale=2; ($now - $START_TIME) / $current")
    left=$(bc <<< "scale=2; $total - $current")
    eta=$(bc <<< "scale=2; $rate * $left")

    # calculate the progress in percentage 
    percent=$(bc <<< "scale=0; 100 * $current / $total" )
    # The number of done and todo characters
    done=$(bc <<< "scale=0; $BAR_SIZE * $percent / 100 - 1" )
    todo=$(bc <<< "scale=0; $BAR_SIZE - $done - 1" )

    # build the done and todo sub-bars
    done_sub_bar=$(printf "%${done}s" | tr " " "${BAR_CHAR_DONE}")
    todo_sub_bar=$(printf "%${todo}s" | tr " " "${BAR_CHAR_TODO}")

    if [ $current -eq $total ]; then
        BAR_CHAR_END="="
        todo_sub_bar=""
    fi

    elapsed=$(bc <<< "scale=0; $now - $START_TIME")

    # output the bar
    echo -ne "\rProgress : [${done_sub_bar}${BAR_CHAR_END}${todo_sub_bar}] ${percent}% ${current}/${total} remaining: ${eta} sec. elapsed: ${elapsed} sec."

    if [ $total -eq $current ]; then
        echo -e"\nDONE"
    fi
}
