import {readFile, writeFile} from "fs";

// from redux-persist
export type OnComplete<Result> = (err?: any, result?: Result) => any;

export default class NodeStorage
{
	private cache: {[key: string]: any} | null = null;
	private fileName: string;
	private isWriting = false;

	/**
	 * @param fileName An absolute path to the file to write the storage to.
	 */
	constructor(fileName: string)
	{
		this.fileName = fileName;
	}

	setItem(key: string, value: any, onComplete?: OnComplete<any>)
	{
		return this.read().then(() => {
			this.cache![key] = value;

			return this.flush().then(onComplete, onComplete);
		}, onComplete);
	}

	getItem<Result>(key: string, onComplete?: OnComplete<Result>)
	{
		return this.read().then(() => {
			const value = this.cache![key];
			if (onComplete) onComplete(null, value);

			return value;
		}, onComplete);
	}

    removeItem(key: string, onComplete?: OnComplete<any>)
	{
		return this.read().then(() => {
			delete this.cache![key];

			return this.flush().then(onComplete, onComplete);
		}, onComplete);
	}

    getAllKeys(onComplete?: OnComplete<string[]>): Promise<string[]>
	{
		return this.read().then(() => {
			const keys = Object.keys(this.cache);
			if (onComplete) onComplete(null, keys);

			return keys;
		}, onComplete);
	}

	private read()
	{
		return new Promise((resolve, reject) => {
			if (this.cache) return resolve();

			readFile(this.fileName, "utf8", (err, data) => {
				if (err)
				{
					if (err.code == "ENOENT")
					{
						this.cache = {};
						return resolve();
					}

					return reject(err);
				}

				resolve(JSON.parse(data));
			});
		});
	}

	private flush()
	{
		return new Promise((resolve, reject) => {
			if (this.isWriting) return resolve();

			this.isWriting = true;
			writeFile(this.fileName, JSON.stringify(this.cache), err => {
				if (err) return reject(err);

				this.isWriting = false;
				resolve();
			});
		});
	}
}
