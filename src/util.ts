import { Email } from 'postal-mime';

// Used to fold headers to get around problematic MS Outlook + Cloudflare bug
export function foldHeader(key: string, value: string) {
	let str = `${key}: ${value}`
	let folded_str = foldLines(str)
	let header_value = folded_str
		.split(key + ':')
		.slice(1)
		.join()
	return {
		key: key,
		value: header_value,
		header: folded_str,
	}
}

/**
 * From https://github.com/nodemailer/libmime/blob/3075051660e703afad1a8196fb2782c3d4f287df/lib/libmime.js#L789C1-L824C6
 * @param str
 * @param lineLength
 * @param afterSpace
 * @returns
 */
export function foldLines(str: string, lineLength: number = 76, afterSpace: boolean = false, linebreak: '\r\n' | '\n' = '\n') {
	str = (str || '').toString()
	lineLength = lineLength || 76

	let pos = 0,
		len = str.length,
		result = '',
		line,
		match

	while (pos < len) {
		line = str.substr(pos, lineLength)
		if (line.length < lineLength) {
			result += line
			break
		}
		if ((match = line.match(/^[^\n\r]*(\r?\n|\r)/))) {
			line = match[0]
			result += line
			pos += line.length
			continue
		} else if ((match = line.match(/(\s+)[^\s]*$/)) && match[0].length - (afterSpace ? (match[1] || '').length : 0) < line.length) {
			line = line.substr(0, line.length - (match[0].length - (afterSpace ? (match[1] || '').length : 0)))
		} else if ((match = str.substr(pos + line.length).match(/^[^\s]+(\s*)/))) {
			line = line + match[0].substr(0, match[0].length - (!afterSpace ? (match[1] || '').length : 0))
		}

		result += line
		pos += line.length
		if (pos < len) {
			result += linebreak
		}
	}

	return result
}
