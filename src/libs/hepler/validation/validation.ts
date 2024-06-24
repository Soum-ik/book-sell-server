import { formatDistanceToNowStrict } from "date-fns";

export function relativeDate(date: Date) {
    return formatDistanceToNowStrict(date, { addSuffix: true });
}