#!/usr/bin/env bash

usage() { echo "Usage: $0 [-t <total>] [-d <delay>]" 1>&2; exit 1; }

function get_options() {
    while [[ $# -gt 0 ]]; do
        key="$1"

        case $key in
            -t|--total)
                total="$2"
                shift 2
                ;;
            -d|--delay)
                delay="$2"
                shift 2
                ;;
            -h|--help)
                usage
                shift
                ;;
            *)
                echo "Unknown option: $1"
                exit 1
                ;;
        esac
    done
}
