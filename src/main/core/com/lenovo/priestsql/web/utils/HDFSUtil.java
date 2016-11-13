package com.lenovo.priestsql.web.utils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.security.PrivilegedExceptionAction;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.GZIPInputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.compress.compressors.bzip2.BZip2CompressorInputStream;
import org.apache.commons.lang3.StringUtils;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.FileUtil;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IOUtils;
import org.apache.hadoop.io.compress.CompressionCodec;
import org.apache.hadoop.io.compress.CompressionCodecFactory;
import org.apache.hadoop.security.UserGroupInformation;
import org.apache.log4j.Logger;
import org.apache.tools.tar.TarEntry;
import org.apache.tools.tar.TarInputStream;

import com.lenovo.priestsql.web.entity.hive.HdfsFile;
import com.lenovo.priestsql.web.factory.FileSystemFactory;
import com.lenovo.priestsql.web.filter.HdfsPathFilter;
import com.lenovo.priestsql.web.utils.HadoopUgiUtil.KerberosType;

/**
 * @author zhouyu16
 * 
 */
public class HDFSUtil {

	static Logger logger = Logger.getLogger(HDFSUtil.class);

	/**
	 * 重名名一个文件夹或者文件
	 * 
	 **/

	public static boolean renameFileOrDirectory(final String oldPath,
			final String newPath, String proxyUser) throws Exception {
		if (checkPath(oldPath) && checkPath(newPath)) {
			try {
				UserGroupInformation ugif = HadoopUgiUtil
						.kerberosLoginReturnUser(KerberosType.FILE, proxyUser);
				if (ugif != null) {
					return (boolean) ugif
							.doAs(new PrivilegedExceptionAction<Object>() {
								@Override
								public Object run() throws Exception {
									FileSystem fs = FileSystemFactory
											.getFileSystem();
									try {
										Path p1 = new Path(oldPath);
										Path p2 = new Path(newPath);
										if (fs.exists(p2)) {
											throw new RuntimeException(
													"The Target Path  Exists!");
										}
										boolean result = fs.rename(p1, p2);
										return result;
									} finally {
										fs.close();// 释放资源
									}
								}
							});
				} else {
					FileSystem fs = FileSystemFactory.getFileSystem();
					try {
						Path p1 = new Path(oldPath);
						Path p2 = new Path(newPath);
						if (fs.exists(p2)) {
							throw new RuntimeException(
									"The Target Path  Exists!");
						}
						boolean result = fs.rename(p1, p2);
						return result;
					} finally {
						fs.close();// 释放资源
					}
				}
			} catch (Exception e) {
				logger.error(e, e);
				throw e;
			}
		} else {
			throw new RuntimeException("Illegal Input Path");
		}
	}

	/**
	 * 复制一个文件夹或者文件
	 * 
	 **/

	public static boolean copyFileOrDirectory(final String sourcePath,
			final String localPath, final String targetPath, String proxyUser)
			throws Exception {
		if (checkPath(sourcePath) && checkPath(targetPath)) {
			try {
				UserGroupInformation ugif = HadoopUgiUtil
						.kerberosLoginReturnUser(KerberosType.FILE, proxyUser);
				if (ugif != null) {
					return (boolean) ugif
							.doAs(new PrivilegedExceptionAction<Object>() {
								@Override
								public Object run() throws Exception {
									FileSystem fs = FileSystemFactory
											.getFileSystem();
									try {
										Path p1 = new Path(sourcePath);
										Path p2 = new Path(targetPath);
										return FileUtil.copy(fs, p1, fs, p2,
												false, fs.getConf());
									} catch (Exception e) {
										throw e;
									} finally {
										fs.close();
									}
								}
							});
				} else {
					FileSystem fs = FileSystemFactory.getFileSystem();
					try {
						Path p1 = new Path(sourcePath);
						Path p2 = new Path(targetPath);
						return FileUtil.copy(fs, p1, fs, p2, false,
								fs.getConf());
					} catch (Exception e) {
						throw e;
					} finally {
						fs.close();
					}
				}
			} catch (Exception e) {
				logger.error(e, e);
				throw e;
			}
		} else {
			throw new RuntimeException("Illegal Input Path");
		}
	}

	/**
	 * 从HDFS上下载文件到本地
	 * 
	 * **/
	public static void downloadFile(final String targetPath,
			final String localPath, String proxyUser) throws Exception {
		if (checkPath(targetPath)) {
			try {
				UserGroupInformation ugif = HadoopUgiUtil
						.kerberosLoginReturnUser(KerberosType.FILE, proxyUser);
				if (ugif != null) {
					ugif.doAs(new PrivilegedExceptionAction<Object>() {
						@Override
						public Object run() throws Exception {
							FileSystem fs = FileSystemFactory.getFileSystem();
							try {
								Path p1 = new Path(targetPath);
								Path p2 = new Path(localPath);
								FileStatus fileStatus = fs.getFileStatus(p1);
								File file = new File(localPath);
								if (file.exists()
										&& file.length() == fileStatus.getLen()) {
									return null;
								}
								long length = 0;
								if (fileStatus.isDirectory()) {
									length = getDirLength(fileStatus, fs);
								} else {
									length = fileStatus.getLen();
								}
								if (length <= 30 * 1024 * 1024) {
									fs.copyToLocalFile(p1, p2);
								} else {
									throw new RuntimeException(
											"Illegal Input Path:too large file");
								}

								return null;
							} finally {
								fs.close();// 释放资源
							}
						}
					});
				} else {
					FileSystem fs = FileSystemFactory.getFileSystem();
					try {
						Path p1 = new Path(targetPath);
						Path p2 = new Path(localPath);
						FileStatus fileStatus = fs.getFileStatus(p1);
						File file = new File(localPath);
						if (file.exists()
								&& file.length() == fileStatus.getLen()) {
						}
						long length = 0;
						if (fileStatus.isDirectory()) {
							length = getDirLength(fileStatus, fs);
						} else {
							length = fileStatus.getLen();
						}
						if (length <= 30 * 1024 * 1024) {
							fs.copyToLocalFile(p1, p2);
						} else {
							throw new RuntimeException(
									"Illegal Input Path:too large file");
						}
					} finally {
						fs.close();// 释放资源
					}
				}
			} catch (Exception e) {
				logger.error(e, e);
				throw e;
			}
		} else {
			throw new RuntimeException("Illegal Input Path");
		}
	}

	/**
	 * 在HDFS上创建一个文件夹
	 * 
	 * **/
	public static boolean createDirectory(final String path, String proxyUser)
			throws Exception {
		if (checkPath(path)) {
			try {
				UserGroupInformation ugif = HadoopUgiUtil
						.kerberosLoginReturnUser(KerberosType.FILE, proxyUser);
				if (ugif != null) {
					return (boolean) ugif
							.doAs(new PrivilegedExceptionAction<Object>() {
								@Override
								public Object run() throws Exception {
									FileSystem fs = FileSystemFactory
											.getFileSystem();
									try {
										Path p = new Path(path);
										if (fs.exists(p)) {
											throw new RuntimeException(
													"The Target Path  Exists!");
										}

										boolean result = fs.mkdirs(p);
										return result;
									} finally {
										fs.close();
									}
								}
							});
				} else {
					FileSystem fs = FileSystemFactory.getFileSystem();
					try {
						Path p = new Path(path);
						if (fs.exists(p)) {
							throw new RuntimeException(
									"The Target Path  Exists!");
						}

						boolean result = fs.mkdirs(p);
						return result;
					} finally {
						fs.close();
					}
				}
			} catch (Exception e) {
				logger.error(e, e);
				throw e;
			}
		} else {
			throw new RuntimeException("Illegal Input Path");
		}
	}

	/**
	 * 在HDFS上删除一个文件夹
	 * 
	 * **/
	public static boolean deleteDirectory(final String path, String proxyUser)
			throws Exception {
		if (checkPath(path)) {
			try {
				UserGroupInformation ugif = HadoopUgiUtil
						.kerberosLoginReturnUser(KerberosType.FILE, proxyUser);
				if (ugif != null) {
					return (boolean) ugif
							.doAs(new PrivilegedExceptionAction<Object>() {
								@Override
								public Object run() throws Exception {
									FileSystem fs = FileSystemFactory
											.getFileSystem();
									try {
										Path p = new Path(path);
										boolean result = fs.deleteOnExit(p);
										return result;
									} finally {
										fs.close();// 释放资源
									}
								}
							});
				} else {
					FileSystem fs = FileSystemFactory.getFileSystem();
					try {
						Path p = new Path(path);
						boolean result = fs.deleteOnExit(p);
						return result;
					} finally {
						fs.close();// 释放资源
					}
				}
			} catch (Exception e) {
				logger.error(e, e);
				throw e;
			}
		} else {
			throw new RuntimeException("Illegal Input Path");
		}
	}

	/**
	 * 在HDFS上创建一个文件
	 * 
	 * **/
	public static boolean createFile(final String path, String proxyUser)
			throws Exception {
		if (checkPath(path)) {
			try {
				UserGroupInformation ugif = HadoopUgiUtil
						.kerberosLoginReturnUser(KerberosType.FILE, proxyUser);
				if (ugif != null) {
					return (boolean) ugif
							.doAs(new PrivilegedExceptionAction<Object>() {
								@Override
								public Object run() throws Exception {
									FileSystem fs = FileSystemFactory
											.getFileSystem();
									try {
										Path p = new Path(path);
										if (fs.exists(p)) {
											throw new RuntimeException(
													"The Target File  Exists!");
										}
										boolean result = fs.createNewFile(p);
										return result;
									} finally {
										fs.close();// 释放资源
									}
								}
							});
				} else {
					FileSystem fs = FileSystemFactory.getFileSystem();
					try {
						Path p = new Path(path);
						if (fs.exists(p)) {
							throw new RuntimeException(
									"The Target File  Exists!");
						}
						boolean result = fs.createNewFile(p);
						return result;
					} finally {
						fs.close();// 释放资源
					}
				}
			} catch (Exception e) {
				logger.error(e, e);
				throw e;
			}
		} else {
			throw new RuntimeException("Illegal Input Path");
		}
	}

	/**
	 * 在HDFS上删除一个文件
	 * 
	 * **/
	public static boolean deleteFile(final String path, String proxyUser)
			throws Exception {
		if (checkPath(path)) {
			try {
				UserGroupInformation ugif = HadoopUgiUtil
						.kerberosLoginReturnUser(KerberosType.FILE, proxyUser);
				if (ugif != null) {
					return (boolean) ugif
							.doAs(new PrivilegedExceptionAction<Object>() {
								@Override
								public Object run() throws Exception {
									FileSystem fs = FileSystemFactory
											.getFileSystem();
									try {
										Path p = new Path(path);
										boolean result = fs.deleteOnExit(p);
										return result;
									} finally {
										fs.close();// 释放资源
									}
								}
							});
				} else {
					FileSystem fs = FileSystemFactory.getFileSystem();
					try {
						Path p = new Path(path);
						boolean result = fs.deleteOnExit(p);
						return result;
					} finally {
						fs.close();// 释放资源
					}
				}
			} catch (Exception e) {

				throw e;
			}
		} else {
			throw new RuntimeException("Illegal Input Path");
		}
	}

	/** 从HDFS上读取文件 */
	public static byte[] readFile(final int page, final int pageSize,
			final String path, String proxyUser) throws Exception, IOException {
		if (checkPath(path)) {
			try {
				UserGroupInformation ugif = HadoopUgiUtil
						.kerberosLoginReturnUser(KerberosType.FILE, proxyUser);
				if (ugif != null) {
					return (byte[]) ugif
							.doAs(new PrivilegedExceptionAction<Object>() {
								@Override
								public Object run() throws Exception {
									FileSystem fs = FileSystemFactory
											.getFileSystem();
									try {
										String dst = path;
										FSDataInputStream hdfsInStream = fs
												.open(new Path(dst));
										byte[] ioBuffer = new byte[pageSize];
										int readLen = hdfsInStream.read(
												(page - 1) * pageSize,
												ioBuffer, 0, pageSize);
										hdfsInStream.close();

										if (readLen != -1) {
											return ioBuffer;
										} else {
											return null;
										}
									} finally {
										fs.close();
									}
								}
							});
				} else {
					FileSystem fs = FileSystemFactory.getFileSystem();
					try {
						String dst = path;
						FSDataInputStream hdfsInStream = fs.open(new Path(dst));
						byte[] ioBuffer = new byte[pageSize];
						int readLen = hdfsInStream.read((page - 1) * pageSize,
								ioBuffer, 0, pageSize);
						hdfsInStream.close();

						if (readLen != -1) {
							return ioBuffer;
						} else {
							return null;
						}
					} finally {
						fs.close();
					}
				}
			} catch (Exception e) {
				logger.error(e, e);
				throw e;
			}
		} else {
			throw new RuntimeException("Illegal Input Path");
		}
	}

	/**
	 * 解压文件，在 目标文件夹下生成解压文件
	 * 
	 * @return
	 * @throws Exception
	 */
	public static void uncompress(final String sourcePath,
			final String targetPath, String proxyUser) throws Exception {
		if (checkPath(sourcePath) && checkPath(targetPath)) {
			try {
				UserGroupInformation ugif = HadoopUgiUtil
						.kerberosLoginReturnUser(KerberosType.FILE, proxyUser);
				if (ugif != null) {
					ugif.doAs(new PrivilegedExceptionAction<Object>() {
						@Override
						public Object run() throws Exception {
							FileSystem fs = FileSystemFactory.getFileSystem();
							FileStatus file = fs.getFileStatus(new Path(
									sourcePath));
							String fileName = file.getPath().getName()
									.toLowerCase();
							if (fileName.endsWith(".deflate")
									|| fileName.endsWith(".lzo")
									|| fileName.endsWith(".snappy")) {
								uncompressForHadoop(sourcePath, targetPath, fs);
							} else {
								uncompress(sourcePath, targetPath, fs);
							}
							return null;
						}
					});
				} else {
					FileSystem fs = FileSystemFactory.getFileSystem();
					FileStatus file = fs.getFileStatus(new Path(sourcePath));
					String fileName = file.getPath().getName().toLowerCase();
					if (fileName.endsWith(".deflate")
							|| fileName.endsWith(".lzo")
							|| fileName.endsWith(".snappy")) {
						uncompressForHadoop(sourcePath, targetPath, fs);
					} else {
						uncompress(sourcePath, targetPath, fs);
					}
				}
			} catch (Exception e) {
				logger.error(e, e);
				throw e;
			}
		} else {
			throw new RuntimeException("Illegal Input Path");
		}
	}

	/** 遍历HDFS上的文件和目录 */
	public static List<HdfsFile> listFile(String path,
			final List<String> filters, String proxyUser) throws Exception {
		if (path == null) {
			path = "/";
		}
		final Path finalPth = new Path(path);
		try {
			FileStatus fileList[] = null;
			UserGroupInformation ugif = HadoopUgiUtil.kerberosLoginReturnUser(
					KerberosType.FILE, proxyUser);
			if (ugif != null) {
				fileList = (FileStatus[]) ugif
						.doAs(new PrivilegedExceptionAction<Object>() {
							@Override
							public Object run() throws Exception {
								FileStatus fileList[] = null;
								FileSystem fs = FileSystemFactory
										.getFileSystem();
								try {
									boolean isDir = fs.isDirectory(finalPth);
									if (!isDir) {
										throw new RuntimeException(
												finalPth
														+ " The Input  Is Not A Directory!");
									}
									if (filters == null || filters.size() == 0) {
										fileList = fs.listStatus(finalPth);
									} else {
										fileList = fs.listStatus(finalPth,
												new HdfsPathFilter(filters));
									}
									return fileList;
								} finally {
									fs.close();
								}
							}
						});
			} else {
				FileSystem fs = FileSystemFactory.getFileSystem();
				try {
					boolean isDir = fs.isDirectory(finalPth);
					if (!isDir) {
						throw new RuntimeException(finalPth
								+ " The Input  Is Not A Directory!");
					}
					if (filters == null || filters.size() == 0) {
						fileList = fs.listStatus(finalPth);
					} else {
						fileList = fs.listStatus(finalPth, new HdfsPathFilter(
								filters));
					}
				} finally {
					fs.close();
				}
			}
			return FileStatusToHdfsFile(fileList);
		} catch (Exception e) {
			logger.error(e, e);
			throw e;
		}
	}

	public static void downloadTmpFile(String key, String path,
			String proxyUser, HttpServletResponse response) {
		try {
			UserGroupInformation ugif = HadoopUgiUtil.kerberosLoginReturnUser(
					KerberosType.FILE, proxyUser);
			FileSystem fs = FileSystemFactory.getFileSystem();
			// 1.设置文件ContentType类型，这样设置，会自动判断下载文件类型
			response.setContentType("multipart/form-data");
			// 2.设置文件头：最后一个参数是设置下载文件名(假如我们叫a.pdf)
			response.setHeader("Content-Disposition", "attachment;fileName="
					+ key);
			ServletOutputStream out = response.getOutputStream();

			if (ugif != null) {
				ugif.doAs(new PrivilegedExceptionAction<Object>() {
					@Override
					public Object run() throws Exception {
						try {
							FileStatus[] files = fs.listStatus(new Path(path));
							for (FileStatus file : files) {
								if (file.isFile()) {
									InputStream is = fs.open(file.getPath());
									int b = 0;
									byte[] buffer = new byte[512];
									while ((b = is.read(buffer)) != -1) {
										// 4.写到输出流(out)中
										out.write(buffer, 0, b);
									}
									is.close();
								}
							}

							return null;
						} finally {
							out.flush();
							out.close();
							fs.close();// 释放资源
						}
					}
				});
			} else {
				try {
					FileStatus[] files = fs.listStatus(new Path(path));
					for (FileStatus file : files) {
						InputStream is = fs.open(file.getPath());
						int b = 0;
						byte[] buffer = new byte[512];
						while ((b = is.read(buffer)) != -1) {
							// 4.写到输出流(out)中
							out.write(buffer, 0, b);
						}
						is.close();
					}
				} finally {
					out.flush();
					out.close();
					fs.close();// 释放资源
				}
			}
		} catch (Exception e) {
			logger.error(e, e);
		}
	}

	private static List<HdfsFile> FileStatusToHdfsFile(FileStatus[] fs) {
		List<HdfsFile> files = new ArrayList<HdfsFile>();
		for (FileStatus fileStatus : fs) {
			files.add(new HdfsFile(fileStatus));
		}
		return files;
	}

	private static boolean checkPath(String path) {
		if (StringUtils.isEmpty(path)) {
			return false;
		}
		return true;
	}

	private static void uncompress(String srcDir, String outputDir,
			FileSystem fs) throws Exception {
		// 建立压缩文件输入流
		TarInputStream tarIn = null;
		InputStream is = null;
		try {
			String srcTemp = srcDir.toLowerCase();
			// 建立grip压缩文件输入流
			if (srcTemp.endsWith(".tar.gz")) {
				tarIn = new TarInputStream(new GZIPInputStream(
						fs.open(new Path(srcDir))));
			} else if (srcTemp.endsWith(".tar.bz2")) {
				tarIn = new TarInputStream(new BZip2CompressorInputStream(
						fs.open(new Path(srcDir))));
			} else if (srcTemp.endsWith(".tgz")) {
				tarIn = new TarInputStream(new GZIPInputStream(
						fs.open(new Path(srcDir))));
			} else if (srcTemp.endsWith(".tar")) {
				tarIn = new TarInputStream(fs.open(new Path(srcDir)));
			} else if (srcTemp.endsWith(".bz2")) {
				is = new BZip2CompressorInputStream(fs.open(new Path(srcDir)));
			} else if (srcTemp.endsWith(".gz")) {
				is = new GZIPInputStream(fs.open(new Path(srcDir)));
			} else if (srcTemp.endsWith(".zip")) {
				is = new ZipInputStream(fs.open(new Path(srcDir)));
			}
			if (srcTemp.endsWith(".tar.gz") || srcTemp.endsWith(".tar.bz2")
					|| srcTemp.endsWith(".tgz") || srcTemp.endsWith(".tar")) {
				TarEntry entry = null;
				while ((entry = tarIn.getNextEntry()) != null) {
					if (entry.isDirectory()) {// 是目录
						fs.mkdirs(new Path(outputDir + "/" + entry.getName()));
					} else {// 是文件
						OutputStream out = fs.create(new Path(outputDir + "/"
								+ entry.getName()));
						try {
							int length = 0;
							byte[] b = new byte[2048];
							while ((length = tarIn.read(b)) != -1) {
								out.write(b, 0, length);
							}
						} catch (Exception e) {
							throw e;
						} finally {
							IOUtils.closeStream(out);
						}
					}
				}
			} else if (srcTemp.endsWith(".zip")) {
				ZipEntry entry = null;
				while ((entry = ((ZipInputStream) is).getNextEntry()) != null) {
					if (entry.isDirectory()) {// 是目录
						fs.mkdirs(new Path(outputDir + "/" + entry.getName()));
					} else {// 是文件
						OutputStream out = fs.create(new Path(outputDir + "/"
								+ entry.getName()));
						try {
							int length = 0;
							byte[] b = new byte[2048];
							while ((length = is.read(b)) != -1) {
								out.write(b, 0, length);
							}
						} catch (Exception e) {
							throw e;
						} finally {
							IOUtils.closeStream(out);
						}
					}
				}
			} else {
				String filename = getFileName(srcDir);
				OutputStream out = fs.create(new Path(outputDir + "/"
						+ filename));
				try {
					int length = 0;
					byte[] b = new byte[2048];
					while ((length = is.read(b)) != -1) {
						out.write(b, 0, length);
					}
				} catch (Exception e) {
					throw e;
				} finally {
					IOUtils.closeStream(out);
				}
			}
		} finally {
			IOUtils.closeStream(tarIn);
			IOUtils.closeStream(is);
			fs.close();
		}
	}

	private static void uncompressForHadoop(String srcDir, String outputDir,
			FileSystem fs) throws Exception {
		InputStream in = null;
		OutputStream out = null;
		try {
			Path p1 = new Path(srcDir);
			CompressionCodecFactory factory = new CompressionCodecFactory(
					fs.getConf());
			CompressionCodec codec = factory.getCodec(p1);
			if (codec == null) {
				throw new RuntimeException("unsupport format!");
			}
			String targetFilename = CompressionCodecFactory.removeSuffix(
					srcDir, codec.getDefaultExtension());
			targetFilename = targetFilename.substring(targetFilename
					.lastIndexOf("/") + 1);
			Path p2 = new Path(outputDir + targetFilename);
			in = codec.createInputStream(fs.open(p1));
			out = fs.create(p2);
			IOUtils.copyBytes(in, out, fs.getConf());
		} finally {
			IOUtils.closeStream(out);
			IOUtils.closeStream(in);
			fs.close();// 释放资源
		}
	}

	private static String getFileName(String path) {
		String[] tmps = path.split("/");
		String fileName = tmps[tmps.length - 1];
		fileName = fileName.substring(0, fileName.lastIndexOf("."));
		return fileName;
	}

	/**
	 * 遍历获取文件夹大小
	 * 
	 * @param fileStatus
	 * @param fs
	 * @return
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
	private static long getDirLength(FileStatus fileStatus, FileSystem fs)
			throws FileNotFoundException, IOException {
		long length = 0;
		FileStatus[] files = fs.listStatus(fileStatus.getPath());
		for (FileStatus fileStatus2 : files) {
			if (fileStatus2.isDirectory()) {
				length += getDirLength(fileStatus2, fs);
			} else {
				length += fileStatus2.getLen();
			}
		}
		return length;
	}
}
