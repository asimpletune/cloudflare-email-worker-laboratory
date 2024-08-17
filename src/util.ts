import { Email } from 'postal-mime';

/**
 * From https://github.com/nodemailer/libmime/blob/3075051660e703afad1a8196fb2782c3d4f287df/lib/libmime.js#L789C1-L824C6
 * @param str
 * @param lineLength
 * @param afterSpace
 * @returns
 */
export function foldLines(str: string, lineLength: number, afterSpace: boolean, crlf: boolean) {
	str = (str || '').toString();
	lineLength = lineLength || 76;

	let pos = 0,
		len = str.length,
		result = '',
		line,
		match;

	while (pos < len) {
		line = str.substr(pos, lineLength);
		if (line.length < lineLength) {
			result += line;
			break;
		}
		if ((match = line.match(/^[^\n\r]*(\r?\n|\r)/))) {
			line = match[0];
			result += line;
			pos += line.length;
			continue;
		} else if ((match = line.match(/(\s+)[^\s]*$/)) && match[0].length - (afterSpace ? (match[1] || '').length : 0) < line.length) {
			line = line.substr(0, line.length - (match[0].length - (afterSpace ? (match[1] || '').length : 0)));
		} else if ((match = str.substr(pos + line.length).match(/^[^\s]+(\s*)/))) {
			line = line + match[0].substr(0, match[0].length - (!afterSpace ? (match[1] || '').length : 0));
		}

		result += line;
		pos += line.length;
		if (pos < len) {
			if (crlf) {
				result += '\r\n';
			} else {
				result += '\n';
			}
		}
	}

	return result;
}

export function getFoldedHeaderValue(header_name: string, full_header: string) {
	let header_value = full_header
		.split(header_name + ':')
		.slice(1)
		.join();
	return header_value;
}

export function headerValue(email: Email, key: string) {
	return email.headers.find((header) => header.key === key)?.value;
}
